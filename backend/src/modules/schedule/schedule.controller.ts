import { Request, Response, NextFunction } from "express";
import { ScheduleService } from "./schedule.service";
import { createVoyageSchema, updateVoyageSchema, scheduleChangeSchema } from "./schedule.schema";

const service = new ScheduleService();

export class ScheduleController {
  async listVoyages(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await service.listVoyages({ page: Number(req.query.page) || 1, limit: Number(req.query.limit) || 20 }));
    } catch (err) { next(err); }
  }

  async getVoyage(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await service.getVoyageById(req.params.id));
    } catch (err) { next(err); }
  }

  async createVoyage(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createVoyageSchema.parse(req.body);
      res.status(201).json(await service.createVoyage(data));
    } catch (err) { next(err); }
  }

  async updateVoyage(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateVoyageSchema.parse(req.body);
      res.json(await service.updateVoyage(req.params.id, data));
    } catch (err) { next(err); }
  }

  async applyScheduleChange(req: Request, res: Response, next: NextFunction) {
    try {
      const data = scheduleChangeSchema.parse(req.body);
      res.json(await service.applyScheduleChange(req.params.id, data));
    } catch (err) { next(err); }
  }
}
