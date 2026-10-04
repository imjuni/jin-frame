import { z } from "zod";

export const securityProviderOverrideSchema = z.object({
  className: z.string().min(1),
  importPath: z.string().min(1),
});
