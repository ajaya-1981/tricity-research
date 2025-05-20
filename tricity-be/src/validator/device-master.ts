import { z } from "zod";

export const createDeviceMasterSchema = z.object({
  section: z.string().min(1),
  deviceType: z.string().min(1),
  brand: z.string().min(1),
  deviceModel: z.string().min(1),
  leadAccessories: z.string().min(1),
  mriCompatible: z.boolean(),
  mriCondition: z.string().optional(),
});

export const updateDeviceMasterSchema = createDeviceMasterSchema.partial();

export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => parseInt(val || "1")),
  limit: z
    .string()
    .optional()
    .transform((val) => parseInt(val || "10")),
});

export const bulkDeleteDeviceMasterSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
});
