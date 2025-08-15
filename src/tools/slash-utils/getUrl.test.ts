import { getUrl } from '#tools/slash-utils/getUrl';
import { describe, expect, it } from 'vitest';

describe('getUrl', () => {
  it('host, path 둘 다 undefined 일 때', () => {
    const result = getUrl();
    expect(result).toEqual({ url: new URL('http://localhost'), str: '/', isOnlyPath: true });
  });

  it('host에 protocol, host, path를 모두 전달 할 때', () => {
    const result = getUrl('http://example.com/:name');
    expect(result).toEqual({
      url: new URL('http://example.com/:name'),
      str: 'http://example.com/:name',
      isOnlyPath: false,
    });
  });

  it('host와 path에 protocol, host, path를 모두 전달 할 때', () => {
    const result = getUrl('http://example.com', '/:name');
    expect(result).toEqual({
      url: new URL('http://example.com/:name'),
      str: 'http://example.com/:name',
      isOnlyPath: false,
    });
  });

  it('host 전달할 때', () => {
    const result = getUrl('example.com/:name');
    expect(result).toEqual({
      url: new URL('http://example.com/:name'),
      str: 'example.com/:name',
      isOnlyPath: false,
    });
  });

  it('host에 host만 전달 할 때', () => {
    const result = getUrl('example.com');
    expect(result).toEqual({ url: new URL('http://example.com'), str: 'example.com', isOnlyPath: false });
  });

  it('path 를 path로 전달할 때', () => {
    const result = getUrl(undefined, '/:name');
    expect(result).toEqual({ url: new URL('http://localhost/:name'), str: ':name', isOnlyPath: true });
  });

  it('path 를 host로 전달할 때', () => {
    const result = getUrl('/:name');
    expect(result).toEqual({ url: new URL('http://localhost/:name'), str: ':name', isOnlyPath: true });
  });
});
