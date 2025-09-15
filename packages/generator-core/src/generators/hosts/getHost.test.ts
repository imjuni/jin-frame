import { describe, expect, it } from 'vitest';
import { getHost } from './getHost';

describe('getHost', () => {
  const document = {
    openapi: '3.0.0',
    info: {
      title: 'Example',
      version: '1.0.0',
    },
    servers: [{ url: 'http://example.com' }],
    paths: {},
  };

  it('should return host when host is provided', () => {
    const result = getHost({ host: 'http://example.com', specTypeFilePath: 'http://example.com', document });
    expect(result).toEqual('http://example.com');
  });

  it('should return host when host is not provided', () => {
    expect(() => getHost({ specTypeFilePath: 'invald', document })).toThrowError();
  });

  it('should return host when host is not provided', () => {
    const result = getHost({
      specTypeFilePath: 'http://example.com',
      document,
    });
    expect(result).toEqual('http://example.com/');
  });

  it('should return host when host is not provided', () => {
    const result = getHost({
      specTypeFilePath: 'http://example.com',
      document: { ...document, servers: [{ url: '/api' }] },
    });
    expect(result).toEqual('http://example.com/api');
  });

  it('should return host when host is not provided', () => {
    const result = getHost({
      specTypeFilePath: 'http://example.com',
      document: { ...document, servers: [] },
    });
    expect(result).toEqual('http://example.com/');
  });
});
