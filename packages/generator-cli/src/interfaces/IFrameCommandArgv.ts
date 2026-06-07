import type { CE_COMMAND } from "#src/interfaces/CE_COMMAND.js";
import type { IGeneratorOption } from "#src/interfaces/IGeneratorOption.js";
import type { IOpenAPITypeScriptOption } from "#src/interfaces/IOpenAPITypeScriptOption.js";

export type TFrameCommandArgv = {
  action: typeof CE_COMMAND.FRAME;
  type: string;
} & IGeneratorOption &
  IOpenAPITypeScriptOption;
