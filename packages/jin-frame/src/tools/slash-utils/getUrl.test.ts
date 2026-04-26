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
    const result = getUrl('http://example.com/{name}');
    expect(result).toEqual({
      url: new URL('http://example.com/%7Bname%7D'),
      pathname: '/%7Bname%7D',
      str: 'http://example.com/{name}',
      isOnlyPath: false,
    });
  });

  // host와 path에 protocol, host, path를 모두 전달 할 때
  it('should return url when pass host made by protocol, hostname and path', () => {
    const result = getUrl('http://example.com', '/{name}');
    expect(result).toEqual({
      url: new URL('http://example.com/%7Bname%7D'),
      str: 'http://example.com/{name}',
      pathname: '/%7Bname%7D',
      isOnlyPath: false,
    });
  });

  it('should return concatenated URL when host, pathPrefix and path are all provided', () => {
    const result = getUrl('http://example.com', '/api', '/{name}');
    expect(result).toEqual({
      url: new URL('http://example.com/api/%7Bname%7D'),
      str: 'http://example.com/api/{name}',
      pathname: '/api/%7Bname%7D',
      isOnlyPath: false,
    });
  });

  it('should return concatenated URL when host is undefined and pathPrefix and path are provided', () => {
    const result = getUrl(undefined, '/api');
    expect(result).toEqual({
      url: new URL('http://localhost/api'),
      str: 'api',
      pathname: '/api',
      isOnlyPath: true,
    });
  });

  it('should return url when pass path using path argument slot', () => {
    const result = getUrl(undefined, undefined, '/{name}');
    expect(result).toEqual({
      url: new URL('http://localhost/%7Bname%7D'),
      str: '{name}',
      pathname: '/%7Bname%7D',
      isOnlyPath: true,
    });
  });

  it('should return url when pass hostname and path without protocol', () => {
    const result = getUrl('example.com/{name}');
    expect(result).toEqual({
      url: new URL('http://example.com/%7Bname%7D'),
      str: 'example.com/{name}',
      pathname: '/%7Bname%7D',
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
    const result = getUrl(undefined, '/{name}');
    expect(result).toEqual({
      url: new URL('http://localhost/%7Bname%7D'),
      str: '{name}',
      pathname: '/%7Bname%7D',
      isOnlyPath: true,
    });
  });

  it('should return url when pass path using host argument slot', () => {
    const result = getUrl('/{name}');
    expect(result).toEqual({
      url: new URL('http://localhost/%7Bname%7D'),
      str: '{name}',
      pathname: '/%7Bname%7D',
      isOnlyPath: true,
    });
  });

  it('should return url when host includes port number', () => {
    const result = getUrl('http://localhost:3000', undefined, '/api/users/42');
    expect(result).toEqual({
      url: new URL('http://localhost:3000/api/users/42'),
      str: 'http://localhost:3000/api/users/42',
      pathname: '/api/users/42',
      isOnlyPath: false,
    });
  });

  it('should return url when host with port and pathPrefix and path are all provided', () => {
    const result = getUrl('http://localhost:3000', '/api', '/users/42');
    expect(result).toEqual({
      url: new URL('http://localhost:3000/api/users/42'),
      str: 'http://localhost:3000/api/users/42',
      pathname: '/api/users/42',
      isOnlyPath: false,
    });
  });

  it('should return url when host is an IP address with port number', () => {
    const result = getUrl('http://127.0.0.1:3000', undefined, '/api/users/42');
    expect(result).toEqual({
      url: new URL('http://127.0.0.1:3000/api/users/42'),
      str: 'http://127.0.0.1:3000/api/users/42',
      pathname: '/api/users/42',
      isOnlyPath: false,
    });
  });
});
