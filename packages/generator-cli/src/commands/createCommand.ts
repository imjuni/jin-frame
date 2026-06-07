import type { CommandModule } from "yargs";
import { createCommandBuilder } from "#/builders/createCommandBuilder";
import { generatorOptionBuilder } from "#/builders/generatorOptionBuilder";
import { openAPITypescriptOptionBuilder } from "#/builders/openAPITypescriptOptionBuilder";
import { createCommandHandler } from "#/handlers/createCommandHandler";
import { CE_COMMAND } from "#/interfaces/CE_COMMAND";
import type { TCreateCommandArgv } from "#/interfaces/ICreateCommandArgv";

export const createCommandModule: CommandModule<TCreateCommandArgv, TCreateCommandArgv> = {
  command: [CE_COMMAND.CREATE, "<spec>"].join(" "),
  describe: "Generate TypeScript type definitions and jin-frame API client from OpenAPI specification",
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
