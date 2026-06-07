import log from "consola";
import { isError } from "my-easy-fp";
import { install as sourceMapSupportInstall } from "source-map-support";
import yargs, { type CommandModule } from "yargs";
import { hideBin } from "yargs/helpers";
import { createCommandModule } from "#src/commands/createCommand.js";
import { frameCommandModule } from "#src/commands/frameCommand.js";
import type { TCreateCommandArgv } from "#src/interfaces/ICreateCommandArgv.js";
import type { TFrameCommandArgv } from "#src/interfaces/IFrameCommandArgv.js";

sourceMapSupportInstall();

const handler = async () => {
  const parser = yargs(hideBin(process.argv));

  parser
    .command(createCommandModule as CommandModule<object, TCreateCommandArgv>)
    .command(frameCommandModule as CommandModule<object, TFrameCommandArgv>)
    .demandCommand()
    .recommendCommands()
    .help();

  await parser.argv;
};

handler().catch((caught) => {
  const err = isError(caught, new Error("unknown error raised"));

  log.error(err.message);
  log.error(err.stack);
});
