import { BearerTokenProvider } from '#providers/security/BearerTokenProvider';
import { describe, expect, it } from 'vitest';

describe('BearerTokenProvider', () => {
  it('should create provider with correct type and name', () => {
    const provider = new BearerTokenProvider();
    expect(provider.type).toBe('http');
    expect(provider.name).toBe('bearer');

    const customProvider = new BearerTokenProvider('custom-bearer');
    expect(customProvider.name).toBe('custom-bearer');
  });

  describe('createContext', () => {
    it('should return empty context when no token is provided', () => {
      const provider = new BearerTokenProvider();
      expect(provider.createContext()).toEqual({});
      expect(provider.createContext(undefined)).toEqual({});
      expect(provider.createContext(null as unknown as undefined)).toEqual({});
      expect(provider.createContext({ token: 'some-token' })).toEqual({});
      expect(provider.createContext(123 as unknown as undefined)).toEqual({});
    });

    it('should apply Bearer prefix to token when token is provided', () => {
      const provider = new BearerTokenProvider();

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

    it('should prioritize dynamic key over authorization', () => {
      const provider = new BearerTokenProvider();

      expect(provider.createContext('auth-token', 'dynamic-token')).toEqual({
        headers: { Authorization: 'Bearer dynamic-token' },
      });
    });

    it('should handle empty string as valid token', () => {
      const provider = new BearerTokenProvider();

      expect(provider.createContext('')).toEqual({
        headers: { Authorization: 'Bearer ' },
      });

      expect(provider.createContext('valid-token', '')).toEqual({
        headers: { Authorization: 'Bearer ' },
      });
    });

    it('should handle whitespace-only token', () => {
      const provider = new BearerTokenProvider();

      expect(provider.createContext('   ')).toEqual({
        headers: { Authorization: 'Bearer    ' },
      });
    });
  });

  describe('setKey', () => {
    it('should use internal key when set', () => {
      const provider = new BearerTokenProvider();
      provider.setKey('internal-token');

      expect(provider.createContext()).toEqual({
        headers: { Authorization: 'Bearer internal-token' },
      });
    });

    it('should prioritize dynamic key over internal key', () => {
      const provider = new BearerTokenProvider();
      provider.setKey('internal-token');

      expect(provider.createContext(undefined, 'dynamic-token')).toEqual({
        headers: { Authorization: 'Bearer dynamic-token' },
      });
    });

    it('should prioritize internal key over authorization data', () => {
      const provider = new BearerTokenProvider();
      provider.setKey('internal-token');

      expect(provider.createContext('auth-token')).toEqual({
        headers: { Authorization: 'Bearer internal-token' },
      });
    });

    it('should allow updating internal key after construction', () => {
      const provider = new BearerTokenProvider();
      provider.setKey('first-token');
      expect(provider.createContext()).toEqual({ headers: { Authorization: 'Bearer first-token' } });

      provider.setKey('second-token');
      expect(provider.createContext()).toEqual({ headers: { Authorization: 'Bearer second-token' } });
    });

    it('should return this for method chaining', () => {
      const provider = new BearerTokenProvider();
      expect(provider.setKey('my-token')).toBe(provider);
    });
  });
});
