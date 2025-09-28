import { applySecurityProviders } from '#tools/auth/applySecurityProviders';
import type { ISecurityProvider } from '#interfaces/security/ISecurityProvider';
import { describe, expect, it } from 'vitest';

describe('applySecurityProviders', () => {
  it('should return empty context when no providers provided', () => {
    const result = applySecurityProviders([]);

    expect(result).toEqual({
      headers: {},
      queries: {},
    });
  });

  it('should merge headers from multiple providers', () => {
    const provider1: ISecurityProvider = {
      type: 'api-key',
      name: 'provider1',
      createContext: () => ({
        headers: { 'X-API-Key': 'key1' },
      }),
    };

    const provider2: ISecurityProvider = {
      type: 'http',
      name: 'provider2',
      createContext: () => ({
        headers: { Authorization: 'Bearer token' },
      }),
    };

    const result = applySecurityProviders([provider1, provider2]);

    expect(result).toEqual({
      headers: {
        'X-API-Key': 'key1',
        Authorization: 'Bearer token',
      },
      queries: {},
    });
  });

  it('should merge queries from multiple providers', () => {
    const provider1: ISecurityProvider = {
      type: 'api-key',
      name: 'provider1',
      createContext: () => ({
        queries: { api_key: 'key1' },
      }),
    };

    const provider2: ISecurityProvider = {
      type: 'api-key',
      name: 'provider2',
      createContext: () => ({
        queries: { token: 'token1' },
      }),
    };

    const result = applySecurityProviders([provider1, provider2]);

    expect(result).toEqual({
      headers: {},
      queries: {
        api_key: 'key1',
        token: 'token1',
      },
    });
  });

  it('should use auth from last provider that provides it', () => {
    const provider1: ISecurityProvider = {
      type: 'http',
      name: 'provider1',
      createContext: () => ({
        auth: { username: 'user1', password: 'pass1' },
      }),
    };

    const provider2: ISecurityProvider = {
      type: 'api-key',
      name: 'provider2',
      createContext: () => ({
        headers: { 'X-API-Key': 'key' },
      }),
    };

    const provider3: ISecurityProvider = {
      type: 'http',
      name: 'provider3',
      createContext: () => ({
        auth: { username: 'user3', password: 'pass3' },
      }),
    };

    const result = applySecurityProviders([provider1, provider2, provider3]);

    expect(result).toEqual({
      headers: {
        'X-API-Key': 'key',
      },
      queries: {},
      auth: { username: 'user3', password: 'pass3' },
    });
  });

  it('should pass authorization data to providers', () => {
    const mockProvider: ISecurityProvider = {
      type: 'api-key',
      name: 'mock',
      createContext: (auth, dynamicKey) => ({
        headers: { Test: `${auth}-${dynamicKey}` },
      }),
    };

    const result = applySecurityProviders([mockProvider], 'static-auth', 'dynamic-auth');

    expect(result).toEqual({
      headers: {
        Test: 'dynamic-auth-dynamic-auth',
      },
      queries: {},
    });
  });

  it('should handle providers that return empty contexts', () => {
    const emptyProvider: ISecurityProvider = {
      type: 'api-key',
      name: 'empty',
      createContext: () => ({}),
    };

    const validProvider: ISecurityProvider = {
      type: 'http',
      name: 'valid',
      createContext: () => ({
        headers: { Authorization: 'Bearer token' },
      }),
    };

    const result = applySecurityProviders([emptyProvider, validProvider]);

    expect(result).toEqual({
      headers: {
        Authorization: 'Bearer token',
      },
      queries: {},
    });
  });

  it('should merge all context types together', () => {
    const fullProvider: ISecurityProvider = {
      type: 'oauth2',
      name: 'full',
      createContext: () => ({
        headers: { Authorization: 'Bearer token' },
        queries: { access_token: 'token123' },
        auth: { username: 'user', password: 'pass' },
      }),
    };

    const result = applySecurityProviders([fullProvider]);

    expect(result).toEqual({
      headers: {
        Authorization: 'Bearer token',
      },
      queries: {
        access_token: 'token123',
      },
      auth: { username: 'user', password: 'pass' },
    });
  });
});
