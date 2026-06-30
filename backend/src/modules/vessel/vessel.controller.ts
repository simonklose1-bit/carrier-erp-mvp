import { Request, Response, NextFunction } from "express";
import { VesselService } from "./vessel.service";
import { createVesselSchema, updateVesselSchema } from "./vessel.schema";

const service = new VesselService();

export class VesselController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const vessels = await service.list({
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 20,
      });
      res.json(vessels);
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const vessel = await service.getById(req.params.id);
      res.json(vessel);
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createVesselSchema.parse(req.body);
      const vessel = await service.create(data);
      res.status(201).json(vessel);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateVesselSchema.parse(req.body);
      const vessel = await service.update(req.params.id, data);
      res.json(vessel);
    } catch (err) {
      next(err);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await service.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
