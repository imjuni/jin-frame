import type { z } from "zod";
import type { frameCommandArgvSchema } from "#schema/args/frameCommandArgvSchema.js";

export type TFrameCommandArgv = z.infer<typeof frameCommandArgvSchema>;
