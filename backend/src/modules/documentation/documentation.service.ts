import { prisma } from "../../shared/utils/prisma";
import { paginate, PaginationQuery } from "../../shared/types/pagination";
import { createError } from "../../shared/middleware/errorHandler";
import { CreateBlDto, AmendBlDto } from "./documentation.schema";

export class DocumentationService {
  async list(pagination: PaginationQuery) {
    const { skip, take } = paginate(pagination);
    const [data, total] = await Promise.all([
      prisma.billOfLading.findMany({ skip, take, include: { booking: true }, orderBy: { createdAt: "desc" } }),
      prisma.billOfLading.count(),
    ]);
    return { data, meta: { total, page: pagination.page ?? 1, limit: take, totalPages: Math.ceil(total / take) } };
  }

  async getById(id: string) {
    const bl = await prisma.billOfLading.findUnique({
      where: { id },
      include: { booking: true, amendmentLog: true, amendments: true },
    });
    if (!bl) throw createError("Bill of Lading not found", 404, "BL_NOT_FOUND");
    return bl;
  }

  async create(data: CreateBlDto) {
    return prisma.billOfLading.create({ data });
  }

  async issue(id: string) {
    const bl = await this.getById(id);
    if (bl.status !== "DRAFT") throw createError("Only DRAFT B/Ls can be issued", 400, "BL_INVALID_STATUS");
    return prisma.billOfLading.update({ where: { id }, data: { status: "ISSUED", issuedAt: new Date() } });
  }

  async surrender(id: string) {
    const bl = await this.getById(id);
    if (bl.status !== "ISSUED") throw createError("Only ISSUED B/Ls can be surrendered", 400, "BL_INVALID_STATUS");
    return prisma.billOfLading.update({ where: { id }, data: { status: "SURRENDERED" } });
  }

  // Amendment logic per session doc:
  // DRAFT → auto-update fields
  // ISSUED/ORIGINAL → surrender all 3 originals first
  // SURRENDERED → create amendment draft directly
  async amend(id: string, dto: AmendBlDto) {
    const bl = await this.getById(id);

    if (bl.status === "ISSUED") {
      throw createError(
        "All 3 originals must be surrendered before amending an ISSUED B/L",
        409,
        "BL_SURRENDER_REQUIRED"
      );
    }

    if (bl.status === "DRAFT") {
      return prisma.billOfLading.update({ where: { id }, data: dto.changedFields as object });
    }

    // SURRENDERED: create new amendment B/L
    const amendmentSeq = bl.amendmentSeq + 1;
    const newBl = await prisma.billOfLading.create({
      data: {
        bookingId: bl.bookingId,
        voyageId: bl.voyageId,
        blNumber: bl.blNumber,
        amendmentSeq,
        status: "DRAFT",
        parentBlId: bl.id,
        vesselName: (dto.changedFields["vessel_name"]?.[1]) ?? bl.vesselName,
        voyageNo: (dto.changedFields["voyage_no"]?.[1]) ?? bl.voyageNo,
        portRotation: bl.portRotation,
        etaPod: bl.etaPod,
      },
    });

    await prisma.blAmendmentLog.create({
      data: {
        blId: newBl.id,
        triggeredBy: dto.triggeredBy,
        changedFields: dto.changedFields,
        actor: dto.actor ?? "SYSTEM",
      },
    });

    await prisma.billOfLading.update({ where: { id }, data: { status: "AMENDED", cancelledAt: new Date() } });

    return newBl;
  }
}
