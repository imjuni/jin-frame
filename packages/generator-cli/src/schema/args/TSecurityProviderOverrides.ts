import type { z } from "zod";
import type { securityProviderSchema } from "#schema/args/securityProviderSchema.js";

export type TSecurityProviderOverrides = z.infer<typeof securityProviderSchema>;
