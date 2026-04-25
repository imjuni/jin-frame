import type { IGeneratorOption } from '#/interfaces/IGeneratorOption';
import { coerceIdentifier } from '#/validators/coerceIdentifier';
import type { Argv } from 'yargs';

export function generatorOptionBuilder(argv: Argv<IGeneratorOption>): Argv<IGeneratorOption> {
  argv
    .option('output', {
      type: 'string',
      demandOption: true,
      describe: 'Output directory path where generated files will be saved',
    })
    .option('log-level', {
      type: 'string',
      choices: ['info', 'debug', 'error'],
      demandOption: false,
      default: 'info',
      describe: 'Log level for controlling verbosity of output messages',
    })
    .option('host', {
      alias: 'h',
      type: 'string',
      demandOption: false,
      describe: 'API server hostname or base URL',
    })
    .option('base-frame', {
      type: 'string',
      default: 'BaseFrame',
      coerce: coerceIdentifier,
      demandOption: false,
      describe: 'Base frame class name to extend from (use --no-base-frame to disable)',
    })
    .option('timeout', {
      type: 'number',
      demandOption: false,
      default: 60_000,
      describe: 'HTTP request timeout in milliseconds',
    })
    .option('code-fence', {
      type: 'boolean',
      demandOption: false,
      default: true,
      describe: 'Whether to wrap generated code with markdown code fences',
    })
    .option('host-strategy', {
      type: 'string',
      choices: ['string', 'function', 'env-function'],
      demandOption: false,
      default: 'string',
      describe: 'Strategy for generating host configuration',
    })
    .option('host-env-var', {
      type: 'string',
      demandOption: false,
      default: 'NODE_ENV',
      describe: 'Environment variable name for host selection (when using env-function)',
    })
    .option('host-function-name', {
      type: 'string',
      demandOption: false,
      default: 'getApiHost',
      describe: 'Custom function name for host resolution (when using function)',
    })
    .option('server-mapping', {
      type: 'string',
      demandOption: false,
      describe: 'Environment to server URL mapping as JSON string',
      coerce: (value: string) => {
        if (!value) return undefined;
        try {
          return JSON.parse(value);
        } catch {
          throw new Error('server-mapping must be valid JSON');
        }
      }
    });

  return argv;
}
