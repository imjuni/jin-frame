import { getUrl } from '#tools/slash-utils/getUrl';
import { describe, expect, it } from 'vitest';

describe('getUrl', () => {
  // host, path 둘 다 undefined 일 때
  it('should return "/" when host, path both undefined', () => {
    const result = getUrl();
    expect(result).toEqual({ url: new URL('http://localhost'), pathname: '/', str: '/', isOnlyPath: true });
  });

  // host에 protocol, host, path를 모두 전달 할 때
  it('should return url when pass only host made by protocol, hostname, path', () => {
    const result = getUrl('http://example.com/:name');
    expect(result).toEqual({
      url: new URL('http://example.com/:name'),
      pathname: '/:name',
      str: 'http://example.com/:name',
      isOnlyPath: false,
    });
  });

  // host와 path에 protocol, host, path를 모두 전달 할 때
  it('should return url when pass host made by protocol, hostname and path', () => {
    const result = getUrl('http://example.com', '/:name');
    expect(result).toEqual({
      url: new URL('http://example.com/:name'),
      str: 'http://example.com/:name',
      pathname: '/:name',
      isOnlyPath: false,
    });
  });

  it('should return url when pass hostname and path without protocol', () => {
    const result = getUrl('example.com/:name');
    expect(result).toEqual({
      url: new URL('http://example.com/:name'),
      str: 'example.com/:name',
      pathname: '/:name',
      isOnlyPath: false,
    });
  });

  it('should return url when pass hostname without protocol', () => {
    const result = getUrl('example.com');
    expect(result).toEqual({
      url: new URL('http://example.com'),
      str: 'example.com',
      pathname: '/',
      isOnlyPath: false,
    });
  });

  it('should return url when pass path using path argument slot', () => {
    const result = getUrl(undefined, '/:name');
    expect(result).toEqual({
      url: new URL('http://localhost/:name'),
      str: ':name',
      pathname: '/:name',
      isOnlyPath: true,
    });
  });

  it('should return url when pass path using host argument slot', () => {
    const result = getUrl('/:name');
    expect(result).toEqual({
      url: new URL('http://localhost/:name'),
      str: ':name',
      pathname: '/:name',
      isOnlyPath: true,
    });
  });
});
