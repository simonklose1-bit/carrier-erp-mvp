import { z } from "zod";

export const createBookingSchema = z.object({
  customerId: z.string().uuid(),
  voyageId: z.string().uuid(),
  pol: z.string().min(3).max(5),
  pod: z.string().min(3).max(5),
  teu: z.number().int().positive(),
  cargoDesc: z.string().optional(),
});

export type CreateBookingDto = z.infer<typeof createBookingSchema>;
