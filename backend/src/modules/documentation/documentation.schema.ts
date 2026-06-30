import { z } from "zod";

export const createBlSchema = z.object({
  bookingId: z.string().uuid(),
  voyageId: z.string().uuid(),
  blNumber: z.string().min(1),
  vesselName: z.string(),
  voyageNo: z.string(),
  portRotation: z.array(z.string()),
  onBoardDate: z.string().datetime().optional(),
  etaPod: z.string().datetime().optional(),
});

export const amendBlSchema = z.object({
  changedFields: z.record(z.tuple([z.string(), z.string()])),
  triggeredBy: z.string(),
  actor: z.string().optional(),
});

export type CreateBlDto = z.infer<typeof createBlSchema>;
export type AmendBlDto = z.infer<typeof amendBlSchema>;
