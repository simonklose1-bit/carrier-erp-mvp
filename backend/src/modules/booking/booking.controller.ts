import { Request, Response, NextFunction } from "express";
import { BookingService } from "./booking.service";
import { createBookingSchema } from "./booking.schema";

const service = new BookingService();

export class BookingController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await service.list({ page: Number(req.query.page) || 1, limit: Number(req.query.limit) || 20 }));
    } catch (err) { next(err); }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await service.getById(req.params.id));
    } catch (err) { next(err); }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createBookingSchema.parse(req.body);
      res.status(201).json(await service.create(data));
    } catch (err) { next(err); }
  }

  async confirm(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await service.confirm(req.params.id));
    } catch (err) { next(err); }
  }

  async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await service.cancel(req.params.id));
    } catch (err) { next(err); }
  }
}
