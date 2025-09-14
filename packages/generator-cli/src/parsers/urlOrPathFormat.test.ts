import { urlOrPathFormat } from '#/cli/parser/urlOrPathFormat';
import { describe, expect, it } from 'vitest';

describe('urlOrPathFormat', () => {
  it('should return file path when given valid existing file path', () => {
    const filePath = '/a/b/c/super-file.yaml';
    const result = urlOrPathFormat(filePath);
    expect(result).toEqual(filePath);
  });

  it('should return URL when given valid URL', () => {
    const url = 'https://api.example.com';
    const result = urlOrPathFormat(new URL(url));
    expect(result).toEqual(`${url}/`);
  });
});
