import { enhanceSafeUrl } from '#/tools/enhanceSafeUrl';
import { describe, expect, it } from 'vitest';

describe('enhanceSafeUrl', () => {
  it('should return key and url when pass only pathname', () => {
    const url = new URL('https://_a677abe80444473e96bc7d27b7638b0f_/api/test/:example');
    const result = enhanceSafeUrl(url.pathname);

    expect(result).toEqual({
      key: 'https://_a677abe80444473e96bc7d27b7638b0f_',
      url,
    });
  });

  it('should return url when pass valid url', () => {
    const url = new URL('https://www.superhero.com/api/test/:example');
    const result = enhanceSafeUrl(url.href);

    expect(result).toEqual({
      key: undefined,
      url,
    });
  });

  it('should return url when pass valid url', () => {
    const result = enhanceSafeUrl('unknown_protocol://www.superhero.com/api/test/:example');

    console.log(result);
  });
});
