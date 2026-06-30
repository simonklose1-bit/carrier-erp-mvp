import { prisma } from "../../shared/utils/prisma";
import { paginate, PaginationQuery } from "../../shared/types/pagination";
import { createError } from "../../shared/middleware/errorHandler";
import { CreateVoyageDto, UpdateVoyageDto, ScheduleChangeDto } from "./schedule.schema";

export class ScheduleService {
  async listVoyages(pagination: PaginationQuery) {
    const { skip, take } = paginate(pagination);
    const [data, total] = await Promise.all([
      prisma.voyage.findMany({
        skip, take,
        include: { vessel: true, service: true },
        orderBy: { etd: "asc" },
      }),
      prisma.voyage.count(),
    ]);
    return { data, meta: { total, page: pagination.page ?? 1, limit: take, totalPages: Math.ceil(total / take) } };
  }

  async getVoyageById(id: string) {
    const voyage = await prisma.voyage.findUnique({
      where: { id },
      include: { vessel: true, service: true, bookings: true },
    });
    if (!voyage) throw createError("Voyage not found", 404, "VOYAGE_NOT_FOUND");
    return voyage;
  }

  async createVoyage(data: CreateVoyageDto) {
    return prisma.voyage.create({ data });
  }

  async updateVoyage(id: string, data: UpdateVoyageDto) {
    await this.getVoyageById(id);
    return prisma.voyage.update({ where: { id }, data });
  }

  // Publishes schedule.change event — rollover logic subscribes via RabbitMQ
  async applyScheduleChange(voyageId: string, change: ScheduleChangeDto) {
    const voyage = await this.getVoyageById(voyageId);

    if (change.changeType === "ETA_CHANGE" && change.newEta) {
      await prisma.voyage.update({
        where: { id: voyageId },
        data: { eta: new Date(change.newEta) },
      });
    }

    // TODO: publish `schedule.change` event to RabbitMQ message bus
    // await messageBus.publish("schedule.change", { voyageId, change });

    return { voyageId, change, status: "PROCESSED" };
  }
}
