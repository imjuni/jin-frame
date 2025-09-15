import type { CommandModule } from 'yargs';
import type { TCreateCommandArgv } from '#/interfaces/ICreateCommandArgv';
import { CE_COMMAND } from '#/interfaces/CE_COMMAND';
import { openAPITypescriptOptionBuilder } from '#/builders/openAPITypescriptOptionBuilder';
import { generatorOptionBuilder } from '#/builders/generatorOptionBuilder';
import { createCommandBuilder } from '#/builders/createCommandBuilder';
import { createCommandHandler } from '#/handlers/createCommandHandler';

export const createCommandModule: CommandModule<TCreateCommandArgv, TCreateCommandArgv> = {
  command: [CE_COMMAND.CREATE, '<spec>'].join(' '),
  describe: 'Generate TypeScript type definitions and jin-frame API client from OpenAPI specification',
  builder: (yargs) => {
    const generatorArgv = generatorOptionBuilder(yargs);
    const openapiTypescriptArgv = openAPITypescriptOptionBuilder(
      generatorArgv as unknown as Parameters<typeof openAPITypescriptOptionBuilder>[0],
    );
    const createCommandArgv = createCommandBuilder(
      openapiTypescriptArgv as unknown as Parameters<typeof createCommandBuilder>[0],
    );
    return createCommandArgv;
  },
  handler: async (argv) => {
    await createCommandHandler(argv);
  },
};
