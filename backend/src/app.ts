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

// Allowed CORS origins — normalized so a trailing slash in FRONTEND_URL
// (e.g. "https://app.vercel.app/") still matches the browser Origin
// (which never has a trailing slash). A mismatch silently blocks all requests.
const allowedOrigins = (process.env.FRONTEND_URL ?? "")
  .split(",")
  .map((o) => o.trim().replace(/\/+$/, ""))
  .filter(Boolean);

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser clients (curl, health checks) with no Origin header.
    if (!origin) return callback(null, true);
    // If no FRONTEND_URL is configured, allow all (dev / MVP fallback).
    if (allowedOrigins.length === 0) return callback(null, true);
    const normalized = origin.replace(/\/+$/, "");
    return callback(null, allowedOrigins.includes(normalized));
  },
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
