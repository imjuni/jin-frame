import type { CE_COMMAND } from '#/interfaces/CE_COMMAND';
import type { IGeneratorOption } from '#/interfaces/IGeneratorOption';
import type { IOpenAPITypeScriptOption } from '#/interfaces/IOpenAPITypeScriptOption';

export type TCreateCommandArgv = {
  action: typeof CE_COMMAND.CREATE;
} & IGeneratorOption &
  IOpenAPITypeScriptOption;
