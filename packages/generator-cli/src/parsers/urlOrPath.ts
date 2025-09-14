import type { ValueParser } from '@optique/core';
import { urlOrPathParser } from '#/cli/parser/urlOrPathParser';
import { urlOrPathFormat } from '#/cli/parser/urlOrPathFormat';

export function urlOrPath(): ValueParser<string | URL> {
  return {
    metavar: 'File or URL path',
    parse: urlOrPathParser,
    format: urlOrPathFormat,
  };
}
