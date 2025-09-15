import { describe, expect, it } from 'vitest';
import { getServerUrl } from './getServerUrl';

describe('getServerUrl', () => {
  it('should return server url when server url is a full url', () => {
    const result = getServerUrl({ specUrl: new URL('http://example.com'), server: { url: 'http://example.com' } });
    expect(result).toEqual({ url: new URL('http://example.com') });
  });

  it('should return server url when server url is a relative url', () => {
    const result = getServerUrl({ specUrl: new URL('http://example.com'), server: { url: '/api' } });
    expect(result).toEqual({ url: new URL('http://example.com/api'), prefix: '/api' });
  });
});
