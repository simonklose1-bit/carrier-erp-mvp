import { z } from "zod";

export const createVoyageSchema = z.object({
  voyageNo: z.string().min(1),
  serviceId: z.string().uuid(),
  vesselId: z.string().uuid(),
  etd: z.string().datetime(),
  eta: z.string().datetime(),
  portCalls: z.array(z.object({
    port: z.string(),
    eta: z.string().datetime(),
    etd: z.string().datetime(),
  })),
});

export const updateVoyageSchema = createVoyageSchema.partial();

export const scheduleChangeSchema = z.object({
  changeType: z.enum(["PORT_OMISSION", "EXTRA_PORT", "ETA_CHANGE"]),
  affectedPort: z.string().optional(),
  newEta: z.string().datetime().optional(),
  reason: z.string().optional(),
});

export type CreateVoyageDto = z.infer<typeof createVoyageSchema>;
export type UpdateVoyageDto = z.infer<typeof updateVoyageSchema>;
export type ScheduleChangeDto = z.infer<typeof scheduleChangeSchema>;
