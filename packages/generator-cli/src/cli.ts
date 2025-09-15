import log from 'consola';
import { isError } from 'my-easy-fp';
import { install as sourceMapSupportInstall } from 'source-map-support';
import { createCommandModule } from '#/commands/createCommand';
import { frameCommandModule } from '#/commands/frameCommand';
import { hideBin } from 'yargs/helpers';
import yargs, { type CommandModule } from 'yargs';
import type { TCreateCommandArgv } from '#/interfaces/ICreateCommandArgv';
import type { TFrameCommandArgv } from '#/interfaces/IFrameCommandArgv';

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
  const err = isError(caught, new Error('unknown error raised'));

  log.error(err.message);
  log.error(err.stack);
});
