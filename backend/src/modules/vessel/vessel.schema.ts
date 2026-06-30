import { z } from "zod";

export const createVesselSchema = z.object({
  name: z.string().min(1),
  imo: z.string().regex(/^\d{7}$/, "IMO must be 7 digits"),
  mmsi: z.string().optional(),
  flagState: z.string().length(2),
  vesselType: z.enum(["CONTAINER", "FEEDER", "RO_RO"]),
  teuCapacity: z.number().int().positive(),
});

export const updateVesselSchema = createVesselSchema.partial().extend({
  status: z.enum(["ACTIVE", "IN_MAINTENANCE", "RETIRED"]).optional(),
});

export type CreateVesselDto = z.infer<typeof createVesselSchema>;
export type UpdateVesselDto = z.infer<typeof updateVesselSchema>;
