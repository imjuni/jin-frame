import type { CE_COMMAND } from "#src/interfaces/CE_COMMAND.js";
import type { IGeneratorOption } from "#src/interfaces/IGeneratorOption.js";
import type { IOpenAPITypeScriptOption } from "#src/interfaces/IOpenAPITypeScriptOption.js";

export type TCreateCommandArgv = {
  action: typeof CE_COMMAND.CREATE;
} & IGeneratorOption &
  IOpenAPITypeScriptOption;
