import { z } from "zod";
import { endpointRetrySchema } from "#schema/args/endpointRetrySchema.js";

export const endpointOverridesSchema = z.object({
  hosts: z.record(z.string(), z.string()).optional(),
  retries: z.record(z.string(), endpointRetrySchema).optional(),
  timeouts: z.record(z.string(), z.coerce.number()).optional(),
});
