import { prisma } from "../../shared/utils/prisma";
import { paginate, PaginationQuery } from "../../shared/types/pagination";
import { createError } from "../../shared/middleware/errorHandler";
import { CreateBookingDto } from "./booking.schema";
import { v4 as uuidv4 } from "uuid";

export class BookingService {
  async list(pagination: PaginationQuery) {
    const { skip, take } = paginate(pagination);
    const [data, total] = await Promise.all([
      prisma.booking.findMany({
        skip, take,
        include: { customer: true, voyage: { include: { vessel: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.booking.count(),
    ]);
    return { data, meta: { total, page: pagination.page ?? 1, limit: take, totalPages: Math.ceil(total / take) } };
  }

  async getById(id: string) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { customer: true, voyage: true, billOfLading: true },
    });
    if (!booking) throw createError("Booking not found", 404, "BOOKING_NOT_FOUND");
    return booking;
  }

  async create(data: CreateBookingDto) {
    const bookingRef = `BKG-${Date.now()}-${uuidv4().slice(0, 6).toUpperCase()}`;
    return prisma.booking.create({ data: { ...data, bookingRef } });
  }

  async confirm(id: string) {
    await this.getById(id);
    return prisma.booking.update({ where: { id }, data: { status: "CONFIRMED" } });
  }

  async cancel(id: string) {
    await this.getById(id);
    return prisma.booking.update({ where: { id }, data: { status: "CANCELLED" } });
  }
}
