import type { ValueParser } from '@optique/core';
import { urlOrPathParser } from '#/parsers/urlOrPathParser';
import { urlOrPathFormat } from '#/parsers/urlOrPathFormat';

export function urlOrPath(): ValueParser<string | URL> {
  return {
    metavar: 'File or URL path',
    parse: urlOrPathParser,
    format: urlOrPathFormat,
  };
}
