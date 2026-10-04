import type { z } from "zod";
import type { createCommandArgvSchema } from "#schema/args/createCommandArgvSchema.js";

export type TCreateCommandArgv = z.infer<typeof createCommandArgvSchema>;
