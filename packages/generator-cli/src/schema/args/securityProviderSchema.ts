import { z } from "zod";
import { securityProviderOverrideSchema } from "#schema/args/securityProviderOverrideSchema.js";

export const securityProviderSchema = z.object({
  securityProviderDir: z.string().min(1).optional(),
  securityProviders: z.record(z.string(), securityProviderOverrideSchema).optional(),
});
