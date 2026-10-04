import { z } from "zod";

export const endpointRetrySchema = z.object({
  interval: z.coerce.number().optional(),
  max: z.coerce.number(),
  useRetryAfter: z.boolean().optional(),
});
