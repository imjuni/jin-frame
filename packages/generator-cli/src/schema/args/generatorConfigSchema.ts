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

export const securityProviderOverrideSchema = z.object({
  className: z.string().min(1),
  importPath: z.string().min(1),
});

export const securityProviderSchema = z.object({
  securityProviderDir: z.string().min(1).optional(),
  securityProviders: z.record(z.string(), securityProviderOverrideSchema).optional(),
});

export type TEndpointRetry = z.infer<typeof endpointRetrySchema>;
export type TEndpointOverrides = z.infer<typeof endpointOverridesSchema>;
export type TSecurityProviderOverrides = z.infer<typeof securityProviderSchema>;
