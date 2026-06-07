import type { CommandModule } from "yargs";
import { frameCommandBuilder } from "#/builders/frameCommandBuilder";
import { generatorOptionBuilder } from "#/builders/generatorOptionBuilder";
import { openAPITypescriptOptionBuilder } from "#/builders/openAPITypescriptOptionBuilder";
import { frameCommandHandler } from "#/handlers/frameCommandHandler";
import { CE_COMMAND } from "#/interfaces/CE_COMMAND";
import type { TFrameCommandArgv } from "#/interfaces/IFrameCommandArgv";

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
