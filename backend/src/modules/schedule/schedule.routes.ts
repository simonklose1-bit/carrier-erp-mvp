import { Router } from "express";
import { ScheduleController } from "./schedule.controller";

export const scheduleRouter = Router();
const ctrl = new ScheduleController();

scheduleRouter.get("/voyages", ctrl.listVoyages.bind(ctrl));
scheduleRouter.get("/voyages/:id", ctrl.getVoyage.bind(ctrl));
scheduleRouter.post("/voyages", ctrl.createVoyage.bind(ctrl));
scheduleRouter.patch("/voyages/:id", ctrl.updateVoyage.bind(ctrl));
scheduleRouter.post("/voyages/:id/change", ctrl.applyScheduleChange.bind(ctrl));
