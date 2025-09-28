import { ApiKeyProvider } from '#providers/security/ApiKeyProvider';
import { describe, expect, it } from 'vitest';

describe('ApiKeyProvider', () => {
  it('should create provider with correct type and name', () => {
    const provider = new ApiKeyProvider('test-api-key', 'X-API-Key');
    expect(provider.name).toBe('test-api-key');
    expect(provider.type).toBe('api-key');
  });

  describe('createContext', () => {
    it('should return empty context when no key is provided', () => {
      const provider = new ApiKeyProvider('test', 'X-API-Key');
      expect(provider.createContext()).toEqual({});
      expect(provider.createContext(undefined)).toEqual({});
      expect(provider.createContext({ username: 'user' })).toEqual({});
    });

    it('should apply key to header location when key is provided', () => {
      const provider = new ApiKeyProvider('test', 'X-API-Key', 'header');

      expect(provider.createContext('api-key')).toEqual({
        headers: { 'X-API-Key': 'api-key' },
      });

      expect(provider.createContext({ key: 'api-key' })).toEqual({
        headers: { 'X-API-Key': 'api-key' },
      });

      expect(provider.createContext(undefined, 'dynamic-key')).toEqual({
        headers: { 'X-API-Key': 'dynamic-key' },
      });
    });

    it('should apply key to query location when location is query', () => {
      const provider = new ApiKeyProvider('test', 'api_key', 'query');

      expect(provider.createContext('api-key')).toEqual({
        queries: { api_key: 'api-key' },
      });
    });

    it('should apply key to cookie location when location is cookie', () => {
      const provider = new ApiKeyProvider('test', 'session', 'cookie');

      expect(provider.createContext('api-key')).toEqual({
        headers: { Cookie: 'session=api-key' },
      });
    });

    it('should return empty context for invalid location', () => {
      const provider = new ApiKeyProvider('test', 'X-API-Key');
      // Force invalid location to test default case
      (provider as any).location = 'invalid';

      expect(provider.createContext('api-key')).toEqual({});
    });

    it('should prioritize dynamic key over authorization', () => {
      const provider = new ApiKeyProvider('test', 'X-API-Key');

      expect(provider.createContext({ key: 'auth-key' }, 'dynamic-key')).toEqual({
        headers: { 'X-API-Key': 'dynamic-key' },
      });
    });

    it('should handle empty string as valid key', () => {
      const provider = new ApiKeyProvider('test', 'X-API-Key');

      expect(provider.createContext('')).toEqual({
        headers: { 'X-API-Key': '' },
      });
    });
  });

  describe('extractKey', () => {
    it('should extract key from string and object', () => {
      expect((ApiKeyProvider as any).extractKey('test-key')).toBe('test-key');
      expect((ApiKeyProvider as any).extractKey({ key: 'test-key' })).toBe('test-key');
      expect((ApiKeyProvider as any).extractKey({ other: 'value' })).toBeUndefined();
      expect((ApiKeyProvider as any).extractKey(null)).toBeUndefined();
    });
  });
});
