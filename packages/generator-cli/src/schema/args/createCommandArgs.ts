import type { ArgsDef } from "citty";
import { generatorOptionArgs } from "#schema/args/generatorOptionArgs.js";
import { openapiTypeScriptOptionArgs } from "#schema/args/openapiTypeScriptOptionArgs.js";

export const createCommandArgs = {
  ...generatorOptionArgs,
  ...openapiTypeScriptOptionArgs,
} satisfies ArgsDef;
