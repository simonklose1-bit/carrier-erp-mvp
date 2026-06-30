import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import { vesselRouter } from "./modules/vessel/vessel.routes";
import { scheduleRouter } from "./modules/schedule/schedule.routes";
import { bookingRouter } from "./modules/booking/booking.routes";
import { documentationRouter } from "./modules/documentation/documentation.routes";
import { errorHandler } from "./shared/middleware/errorHandler";

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL ?? "*",
  credentials: true,
}));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", version: "0.1.0" });
});

app.use("/api/v1/vessels", vesselRouter);
app.use("/api/v1/schedules", scheduleRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/documentation", documentationRouter);

app.use(errorHandler);

export default app;
