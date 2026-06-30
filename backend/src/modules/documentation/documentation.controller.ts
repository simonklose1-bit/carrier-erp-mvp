import { Request, Response, NextFunction } from "express";
import { DocumentationService } from "./documentation.service";
import { createBlSchema, amendBlSchema } from "./documentation.schema";

const service = new DocumentationService();

export class DocumentationController {
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
      res.status(201).json(await service.create(createBlSchema.parse(req.body)));
    } catch (err) { next(err); }
  }

  async issue(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await service.issue(req.params.id));
    } catch (err) { next(err); }
  }

  async surrender(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await service.surrender(req.params.id));
    } catch (err) { next(err); }
  }

  async amend(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await service.amend(req.params.id, amendBlSchema.parse(req.body)));
    } catch (err) { next(err); }
  }
}
