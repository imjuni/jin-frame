import type { z } from "zod";
import type { openapiTypeScriptOptionSchema } from "#schema/args/openapiTypeScriptOptionSchema.js";

export type TOpenAPITypeScriptOption = z.infer<typeof openapiTypeScriptOptionSchema>;
