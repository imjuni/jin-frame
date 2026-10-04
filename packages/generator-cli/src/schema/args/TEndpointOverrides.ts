import type { z } from "zod";
import type { endpointOverridesSchema } from "#schema/args/endpointOverridesSchema.js";

export type TEndpointOverrides = z.infer<typeof endpointOverridesSchema>;
