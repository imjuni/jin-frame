import { openapiTypescriptOptions } from '#/cli/parser/openapiTypescriptOptions';
import pathe from 'pathe';
import { urlOrPath } from '#/cli/parser/urlOrPath';
import {
  or,
  command,
  object,
  constant,
  option,
  string,
  choice,
  argument,
  merge,
  withDefault,
  map,
  integer,
  optional,
} from '@optique/core';
import { path } from '@optique/run';

export const createCommand = command(
  'create',
  merge(
    object({
      action: constant('create'),
      spec: argument(urlOrPath()),
      output: option<string>(
        '-o',
        '--output',
        path({
          mustExist: false,
          allowCreate: true,
          type: 'directory',
          metavar: pathe.join(process.cwd(), 'spec'),
        }),
      ),
      logLevel: withDefault(option('--log-level', choice(['debug', 'info', 'error'])), 'info'),
      host: option('-h', '--host', string({ metavar: 'https://api.example.com' })),
      baseFrame: withDefault(
        or(
          option('--base-frame', string({ metavar: 'BaseFrame' })),
          map(option('--no-base-frame'), () => undefined),
        ),
        'BaseFrame',
      ),
      timeout: optional(option('--timeout', integer({ metavar: '60000' }))),
      codeFence: withDefault(
        or(
          map(option('--code-fence'), (value) => value),
          map(option('--no-code-fence'), (value) => !value),
        ),
        true,
      ),
    }),
    openapiTypescriptOptions,
  ),
);
