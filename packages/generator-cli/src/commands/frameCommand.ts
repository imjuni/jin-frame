import { openapiTypescriptOptions } from '#/parsers/openapiTypescriptOptions';
import { command, object, constant, merge, message, option } from '@optique/core';
import { generatorCliOptions } from '#/parsers/generatorCliOptions';
import { path } from '@optique/run';
import pathe from 'pathe';

export const frameCommand = command(
  'frame',
  merge(
    object({
      action: constant('frame'),
      type: option<string>(
        '-t',
        '--type',
        path({
          mustExist: false,
          type: 'file',
          metavar: pathe.join(process.cwd(), 'paths.d.ts'),
        }),
      ),
    }),
    generatorCliOptions,
    openapiTypescriptOptions,
  ),
  {
    description: message`jin-frame api client를 생성합니다`,
  },
);
