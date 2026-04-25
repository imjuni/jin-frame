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

  it('should return undefined when given empty value', () => {
    const r01 = safeUrl(undefined);
    const r02 = safeUrl(null);

    expect(r01).toBeUndefined();
    expect(r02).toBeUndefined();
  });

  it('should return undefined when given non string type', () => {
    const r01 = safeUrl(1);
    const r02 = safeUrl(true);
    const r03 = safeUrl(BigInt(1));
    const r04 = safeUrl({ name: 'ironman' });
    const r05 = safeUrl(() => undefined);

    expect(r01).toBeUndefined();
    expect(r02).toBeUndefined();
    expect(r03).toBeUndefined();
    expect(r04).toBeUndefined();
    expect(r05).toBeUndefined();
  });
});
