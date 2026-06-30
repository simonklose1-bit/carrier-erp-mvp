import { prisma } from "../../shared/utils/prisma";
import { paginate, PaginationQuery } from "../../shared/types/pagination";
import { createError } from "../../shared/middleware/errorHandler";
import { CreateVesselDto, UpdateVesselDto } from "./vessel.schema";

export class VesselService {
  async list(pagination: PaginationQuery) {
    const { skip, take } = paginate(pagination);
    const [data, total] = await Promise.all([
      prisma.vessel.findMany({ skip, take, orderBy: { name: "asc" } }),
      prisma.vessel.count(),
    ]);
    return {
      data,
      meta: {
        total,
        page: pagination.page ?? 1,
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async getById(id: string) {
    const vessel = await prisma.vessel.findUnique({ where: { id } });
    if (!vessel) throw createError("Vessel not found", 404, "VESSEL_NOT_FOUND");
    return vessel;
  }

  async create(data: CreateVesselDto) {
    return prisma.vessel.create({ data });
  }

  async update(id: string, data: UpdateVesselDto) {
    await this.getById(id);
    return prisma.vessel.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.getById(id);
    await prisma.vessel.delete({ where: { id } });
  }
}
