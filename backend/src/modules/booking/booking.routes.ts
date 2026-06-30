import { Router } from "express";
import { BookingController } from "./booking.controller";

export const bookingRouter = Router();
const ctrl = new BookingController();

bookingRouter.get("/", ctrl.list.bind(ctrl));
bookingRouter.get("/:id", ctrl.getById.bind(ctrl));
bookingRouter.post("/", ctrl.create.bind(ctrl));
bookingRouter.patch("/:id/confirm", ctrl.confirm.bind(ctrl));
bookingRouter.patch("/:id/cancel", ctrl.cancel.bind(ctrl));
