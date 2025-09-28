import { getAuthorization } from '#tools/auth/getAuthorization';
import { BearerTokenProvider } from '#providers/security/BearerTokenProvider';
import { ApiKeyProvider } from '#providers/security/ApiKeyProvider';
import { BasicAuthProvider } from '#providers/security/BasicAuthProvider';
import { describe, expect, it } from 'vitest';

describe('getAuthorization', () => {
  it('should return authKey undefined and auth undefined when empty header, undefined authorization, undefined auth', () => {
    const result = getAuthorization({}, {}, undefined);
    expect(result).toEqual({ authKey: undefined, auth: undefined });
  });

  it('should return authKey string and auth undefined when header have Authorization, undefined authorization, undefined auth', () => {
    const key = 'Bearer i-am-key';
    const result = getAuthorization({ Authorization: key }, {}, undefined);
    expect(result).toEqual({ authKey: key, auth: undefined });
  });

  it('should return authKey undefined and auth when header is empty, undefined authorization, auth', () => {
    const auth = { username: 'ironman', password: 'marvel' };
    const result = getAuthorization({}, {}, auth);
    expect(result).toEqual({ authKey: undefined, auth });
  });

  it('should handle SecurityProvider with Bearer token', () => {
    const provider = new BearerTokenProvider();
    const result = getAuthorization({}, { security: provider, authorization: 'my-token' }, undefined);

    expect(result.authKey).toBe('Bearer my-token');
    expect(result.securityHeaders).toEqual({ Authorization: 'Bearer my-token' });
    expect(result.auth).toBeUndefined();
  });

  it('should handle SecurityProvider with API key in header', () => {
    const provider = new ApiKeyProvider('api-key', 'X-API-Key', 'header');
    const result = getAuthorization({}, { security: provider, authorization: 'api-key-value' }, undefined);

    expect(result.securityHeaders).toEqual({ 'X-API-Key': 'api-key-value' });
    expect(result.authKey).toBeUndefined();
  });

  it('should handle SecurityProvider with API key in query', () => {
    const provider = new ApiKeyProvider('api-key', 'api_key', 'query');
    const result = getAuthorization({}, { security: provider, authorization: 'api-key-value' }, undefined);

    expect(result.securityQueries).toEqual({ api_key: 'api-key-value' });
    expect(result.authKey).toBeUndefined();
  });

  it('should handle SecurityProvider with Basic auth', () => {
    const provider = new BasicAuthProvider();
    const auth = { username: 'user', password: 'pass' };
    const result = getAuthorization({}, { security: provider, authorization: auth }, undefined);

    expect(result.auth).toEqual({ username: 'user', password: 'pass' });
    expect(result.authKey).toBeUndefined();
  });

  it('should handle multiple SecurityProviders', () => {
    const bearerProvider = new BearerTokenProvider();
    const apiKeyProvider = new ApiKeyProvider('api-key', 'X-API-Key', 'header');

    const result = getAuthorization(
      {},
      {
        security: [bearerProvider, apiKeyProvider],
        authorization: 'my-token',
      },
      undefined,
    );

    expect(result.authKey).toBe('Bearer my-token');
    expect(result.securityHeaders).toEqual({
      Authorization: 'Bearer my-token',
      'X-API-Key': 'my-token',
    });
  });

  it('should handle dynamic auth overriding frame authorization', () => {
    const provider = new BearerTokenProvider();
    const result = getAuthorization(
      {},
      { security: provider, authorization: 'frame-token' },
      undefined,
      'dynamic-token',
    );

    expect(result.authKey).toBe('Bearer dynamic-token');
    expect(result.securityHeaders).toEqual({ Authorization: 'Bearer dynamic-token' });
  });

  // Backward compatibility tests for deprecated authoriztion field
  it('should handle legacy authoriztion string field', () => {
    const result = getAuthorization({}, { authoriztion: 'Bearer legacy-token' }, undefined);

    expect(result.authKey).toBe('Bearer legacy-token');
    expect(result.auth).toBeUndefined();
  });

  it('should handle legacy authoriztion auth object field', () => {
    const auth = { username: 'legacy-user', password: 'legacy-pass' };
    const result = getAuthorization({}, { authoriztion: auth }, undefined);

    expect(result.authKey).toBeUndefined();
    expect(result.auth).toEqual(auth);
  });

  it('should prioritize new security field over legacy authoriztion field', () => {
    const provider = new BearerTokenProvider();
    const result = getAuthorization(
      {},
      {
        security: provider,
        authorization: 'new-token',
        authoriztion: 'legacy-token',
      },
      undefined,
    );

    // Should use new security system, not legacy
    expect(result.authKey).toBe('Bearer new-token');
    expect(result.securityHeaders).toEqual({ Authorization: 'Bearer new-token' });
  });
});
