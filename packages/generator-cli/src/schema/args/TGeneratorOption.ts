import type { z } from "zod";
import type { generatorOptionSchema } from "#schema/args/generatorOptionSchema.js";

export type TGeneratorOption = z.infer<typeof generatorOptionSchema>;
