import type { z } from "zod";
import type { endpointRetrySchema } from "#schema/args/endpointRetrySchema.js";

export type TEndpointRetry = z.infer<typeof endpointRetrySchema>;
