import { z } from "zod";

export const endpointRetrySchema = z.object({
  interval: z.coerce.number().optional(),
  max: z.coerce.number(),
  useRetryAfter: z.boolean().optional(),
});

export const endpointOverridesSchema = z.object({
  hosts: z.record(z.string(), z.string()).optional(),
  retries: z.record(z.string(), endpointRetrySchema).optional(),
  timeouts: z.record(z.string(), z.coerce.number()).optional(),
});

export type TEndpointRetry = z.infer<typeof endpointRetrySchema>;
export type TEndpointOverrides = z.infer<typeof endpointOverridesSchema>;
