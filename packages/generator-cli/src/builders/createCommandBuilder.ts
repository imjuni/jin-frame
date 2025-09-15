import { CE_COMMAND } from '#/interfaces/CE_COMMAND';
import type { TCreateCommandArgv } from '#/interfaces/ICreateCommandArgv';
import { coercePathOrUrl } from '#/validators/coercePathOrUrl';
import type { Argv } from 'yargs';

export function createCommandBuilder(argv: Argv<TCreateCommandArgv>): Argv<TCreateCommandArgv> {
  argv
    .option('action', {
      type: 'string',
      default: CE_COMMAND.CREATE,
      hidden: true,
    })
    .positional('spec', {
      type: 'string',
      demandOption: true,
      describe: 'Path to the OpenAPI specification file (JSON or YAML)',
      coerce: coercePathOrUrl,
    });

  return argv;
}
