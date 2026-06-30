import { Router } from "express";
import { VesselController } from "./vessel.controller";

export const vesselRouter = Router();
const ctrl = new VesselController();

vesselRouter.get("/", ctrl.list.bind(ctrl));
vesselRouter.get("/:id", ctrl.getById.bind(ctrl));
vesselRouter.post("/", ctrl.create.bind(ctrl));
vesselRouter.patch("/:id", ctrl.update.bind(ctrl));
vesselRouter.delete("/:id", ctrl.remove.bind(ctrl));
