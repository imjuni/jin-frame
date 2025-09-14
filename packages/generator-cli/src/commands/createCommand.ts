import { openapiTypescriptOptions } from '#/parsers/openapiTypescriptOptions';
import { command, object, constant, merge, message } from '@optique/core';
import { generatorCliOptions } from '#/parsers/generatorCliOptions';

export const createCommand = command(
  'create',
  merge(
    object({
      action: constant('create'),
    }),
    generatorCliOptions,
    openapiTypescriptOptions,
  ),
  {
    description: message`path.d.ts 파일과 jin frame api client를 생성합니다`,
  },
);
