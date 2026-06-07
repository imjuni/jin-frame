import type { CommandModule } from "yargs";
import { frameCommandBuilder } from "#src/builders/frameCommandBuilder.js";
import { generatorOptionBuilder } from "#src/builders/generatorOptionBuilder.js";
import { openAPITypescriptOptionBuilder } from "#src/builders/openAPITypescriptOptionBuilder.js";
import { frameCommandHandler } from "#src/handlers/frameCommandHandler.js";
import { CE_COMMAND } from "#src/interfaces/CE_COMMAND.js";
import type { TFrameCommandArgv } from "#src/interfaces/IFrameCommandArgv.js";

export const frameCommandModule: CommandModule<TFrameCommandArgv, TFrameCommandArgv> = {
  command: [CE_COMMAND.FRAME, "<spec>"].join(" "),
  describe: "Generate jin-frame API client classes from existing TypeScript type definitions",
  builder: (yargs) => {
    const generatorArgv = generatorOptionBuilder(yargs) as unknown as Parameters<
      typeof openAPITypescriptOptionBuilder
    >[0];
    const openapiTypescriptArgv = openAPITypescriptOptionBuilder(generatorArgv) as unknown as Parameters<
      typeof frameCommandBuilder
    >[0];
    const frameCommandArgv = frameCommandBuilder(openapiTypescriptArgv);

    return frameCommandArgv;
  },
  handler: async (argv) => {
    await frameCommandHandler(argv);
  },
};
