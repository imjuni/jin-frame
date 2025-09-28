import { BasicAuthProvider } from '#providers/security/BasicAuthProvider';
import { describe, expect, it } from 'vitest';

describe('BasicAuthProvider', () => {
  it('should create provider with correct type and name', () => {
    const provider = new BasicAuthProvider();
    expect(provider.type).toBe('http');
    expect(provider.name).toBe('basic');

    const customProvider = new BasicAuthProvider('custom-basic');
    expect(customProvider.name).toBe('custom-basic');
  });

  describe('createContext', () => {
    it('should return empty context when no authorization is provided', () => {
      const provider = new BasicAuthProvider();
      expect(provider.createContext()).toEqual({});
      expect(provider.createContext(undefined)).toEqual({});
      expect(provider.createContext(null as any)).toEqual({});
      expect(provider.createContext({ key: 'api-key' })).toEqual({});
      expect(provider.createContext(123 as any)).toEqual({});
    });

    it('should apply Basic prefix to string authorization when string is provided', () => {
      const provider = new BasicAuthProvider();

      expect(provider.createContext('encoded-value')).toEqual({
        headers: { Authorization: 'Basic encoded-value' },
      });

      expect(provider.createContext('Basic encoded-value')).toEqual({
        headers: { Authorization: 'Basic encoded-value' },
      });

      expect(provider.createContext(undefined, 'dynamic-value')).toEqual({
        headers: { Authorization: 'Basic dynamic-value' },
      });
    });

    it('should create auth object when username/password object is provided', () => {
      const provider = new BasicAuthProvider();

      expect(provider.createContext({ username: 'user', password: 'pass' })).toEqual({
        auth: { username: 'user', password: 'pass' },
      });
    });

    it('should return empty context when object is incomplete', () => {
      const provider = new BasicAuthProvider();

      expect(provider.createContext({ username: 'user' })).toEqual({});
      expect(provider.createContext({ password: 'pass' })).toEqual({});
      expect(provider.createContext({})).toEqual({});
    });

    it('should prioritize dynamic key over authorization', () => {
      const provider = new BasicAuthProvider();

      expect(provider.createContext({ username: 'user', password: 'pass' }, 'dynamic-value')).toEqual({
        headers: { Authorization: 'Basic dynamic-value' },
      });

      expect(provider.createContext({ username: 'user', password: 'pass' }, '')).toEqual({
        auth: { username: 'user', password: 'pass' },
      });
    });

    it('should handle empty string as valid authorization', () => {
      const provider = new BasicAuthProvider();

      expect(provider.createContext('')).toEqual({
        headers: { Authorization: 'Basic ' },
      });

      expect(provider.createContext('   ')).toEqual({
        headers: { Authorization: 'Basic    ' },
      });
    });
  });

  describe('handleDynamicKey', () => {
    it('should handle dynamic key with and without Basic prefix', () => {
      expect((BasicAuthProvider as any).handleDynamicKey('encoded-value')).toEqual({
        headers: { Authorization: 'Basic encoded-value' },
      });

      expect((BasicAuthProvider as any).handleDynamicKey('Basic encoded-value')).toEqual({
        headers: { Authorization: 'Basic encoded-value' },
      });
    });
  });
});
