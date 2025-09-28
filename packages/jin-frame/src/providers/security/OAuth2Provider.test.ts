import { OAuth2Provider } from '#providers/security/OAuth2Provider';
import { describe, expect, it } from 'vitest';

describe('OAuth2Provider', () => {
  it('should create provider with correct type and name', () => {
    const provider = new OAuth2Provider('oauth2-test');
    expect(provider.type).toBe('oauth2');
    expect(provider.name).toBe('oauth2-test');
  });

  it('should use default Bearer token type when token type not provided', () => {
    const provider = new OAuth2Provider('test');
    expect(provider.createContext('token')).toEqual({
      headers: { Authorization: 'Bearer token' },
    });
  });

  it('should use custom token type when token type is provided', () => {
    const provider = new OAuth2Provider('test', 'Token');
    expect(provider.createContext('token')).toEqual({
      headers: { Authorization: 'Token token' },
    });
  });

  describe('createContext', () => {
    it('should return empty context when no token is provided', () => {
      const provider = new OAuth2Provider('test');
      expect(provider.createContext()).toEqual({});
      expect(provider.createContext(undefined)).toEqual({});
      expect(provider.createContext(null as any)).toEqual({});
      expect(provider.createContext({ token: 'some-token' })).toEqual({});
      expect(provider.createContext(123 as any)).toEqual({});
    });

    it('should apply token type prefix to string token when token is provided', () => {
      const provider = new OAuth2Provider('test');

      expect(provider.createContext('token')).toEqual({
        headers: { Authorization: 'Bearer token' },
      });

      expect(provider.createContext('Bearer token')).toEqual({
        headers: { Authorization: 'Bearer token' },
      });

      expect(provider.createContext(undefined, 'dynamic-token')).toEqual({
        headers: { Authorization: 'Bearer dynamic-token' },
      });
    });

    it('should extract accessToken from object when object has accessToken property', () => {
      const provider = new OAuth2Provider('test');

      expect(provider.createContext({ accessToken: 'oauth-token' })).toEqual({
        headers: { Authorization: 'Bearer oauth-token' },
      });
    });

    it('should prioritize dynamic key over authorization', () => {
      const provider = new OAuth2Provider('test');

      expect(provider.createContext({ accessToken: 'auth-token' }, 'dynamic-token')).toEqual({
        headers: { Authorization: 'Bearer dynamic-token' },
      });

      expect(provider.createContext({ accessToken: 'auth-token' }, null as any)).toEqual({
        headers: { Authorization: 'Bearer auth-token' },
      });
    });

    it('should handle empty string as valid token', () => {
      const provider = new OAuth2Provider('test');

      expect(provider.createContext('')).toEqual({
        headers: { Authorization: 'Bearer ' },
      });

      expect(provider.createContext({ accessToken: 'valid-token' }, '')).toEqual({
        headers: { Authorization: 'Bearer ' },
      });
    });

    it('should handle custom token type correctly', () => {
      const provider = new OAuth2Provider('test', 'Token');

      expect(provider.createContext('token')).toEqual({
        headers: { Authorization: 'Token token' },
      });

      expect(provider.createContext('Token already-prefixed')).toEqual({
        headers: { Authorization: 'Token already-prefixed' },
      });
    });
  });

  describe('extractAccessToken', () => {
    it('should extract token from string and object', () => {
      expect((OAuth2Provider as any).extractAccessToken('test-token')).toBe('test-token');
      expect((OAuth2Provider as any).extractAccessToken({ accessToken: 'oauth-token' })).toBe('oauth-token');
      expect((OAuth2Provider as any).extractAccessToken({ other: 'value' })).toBeUndefined();
      expect((OAuth2Provider as any).extractAccessToken(null)).toBeUndefined();
    });
  });
});
