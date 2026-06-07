import type { CommandModule } from "yargs";
import { createCommandBuilder } from "#src/builders/createCommandBuilder.js";
import { generatorOptionBuilder } from "#src/builders/generatorOptionBuilder.js";
import { openAPITypescriptOptionBuilder } from "#src/builders/openAPITypescriptOptionBuilder.js";
import { createCommandHandler } from "#src/handlers/createCommandHandler.js";
import { CE_COMMAND } from "#src/interfaces/CE_COMMAND.js";
import type { TCreateCommandArgv } from "#src/interfaces/ICreateCommandArgv.js";

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
