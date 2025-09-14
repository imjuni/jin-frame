import { urlOrPath } from '#/cli/parser/urlOrPath';
import { urlOrPathFormat } from '#/cli/parser/urlOrPathFormat';
import { urlOrPathParser } from '#/cli/parser/urlOrPathParser';
import { describe, expect, it } from 'vitest';

describe('urlOrPath', () => {
  it('should return parser configuration with metavar, parse and format functions', () => {
    const result = urlOrPath();

    expect(result).toEqual({
      metavar: 'File or URL path',
      parse: urlOrPathParser,
      format: urlOrPathFormat,
    });
  });
});
