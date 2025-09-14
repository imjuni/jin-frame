import { safeUrl } from '#/tools/safeUrl';
import { describe, expect, it } from 'vitest';

describe('safeUrl', () => {
  it('should return URL when given valid URL', () => {
    const url = 'https://api.example.com';
    const result = safeUrl(url);
    expect(result).toEqual(new URL(url));
  });

  it('should return undefined when given invalid URL', () => {
    const url = 'invalid-url';
    const result = safeUrl(url);
    expect(result).toBeUndefined();
  });
});
