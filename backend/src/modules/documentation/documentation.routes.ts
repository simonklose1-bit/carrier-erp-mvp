import { Router } from "express";
import { DocumentationController } from "./documentation.controller";

export const documentationRouter = Router();
const ctrl = new DocumentationController();

documentationRouter.get("/bills-of-lading", ctrl.list.bind(ctrl));
documentationRouter.get("/bills-of-lading/:id", ctrl.getById.bind(ctrl));
documentationRouter.post("/bills-of-lading", ctrl.create.bind(ctrl));
documentationRouter.post("/bills-of-lading/:id/issue", ctrl.issue.bind(ctrl));
documentationRouter.post("/bills-of-lading/:id/surrender", ctrl.surrender.bind(ctrl));
documentationRouter.post("/bills-of-lading/:id/amend", ctrl.amend.bind(ctrl));
