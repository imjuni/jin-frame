import type { ArgsDef } from "citty";
import { generatorOptionArgs } from "#src/schema/args/generatorOptionArgs.js";
import { openapiTypeScriptOptionArgs } from "#src/schema/args/openapiTypeScriptOptionArgs.js";

export const createCommandArgs = {
  ...generatorOptionArgs,
  ...openapiTypeScriptOptionArgs,
} satisfies ArgsDef;
