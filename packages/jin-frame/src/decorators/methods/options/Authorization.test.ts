import { describe, expect, it } from 'vitest';
import { getRequestMeta } from '#decorators/methods/handlers/getRequestMeta';
import { Authorization } from '#decorators/methods/options/Authorization';

describe('Authorization', () => {
  it('should set authorization metadata correctly when Authorization decorator applied with string token', () => {
    class TestClass {}

    const authToken = 'Bearer my-secret-token';
    const handle = Authorization(authToken);
    handle(TestClass);

    const meta = getRequestMeta(TestClass);

    expect(meta.option.authorization).toEqual(authToken);
  });

  it('should set authorization metadata correctly when Authorization decorator applied with object data', () => {
    class TestClass {}

    const authData = {
      apiKey: 'secret-api-key',
      userId: 'user123',
      sessionId: 'session456',
    };
    const handle = Authorization(authData);
    handle(TestClass);

    const meta = getRequestMeta(TestClass);

    expect(meta.option.authorization).toEqual(authData);
  });

  it('should support complex authorization data structures', () => {
    class TestClass {}

    const authData = {
      bearerToken: 'Bearer token123',
      apiKey: 'api-key-456',
      sessionId: 'session-789',
    };

    const handle = Authorization(authData);
    handle(TestClass);

    const meta = getRequestMeta(TestClass);

    expect(meta.option.authorization).toEqual(authData);
  });

  it('should freeze authorization option to prevent mutation', () => {
    class TestClass {}

    const authData = { apiKey: 'secret-key', userId: 'user123' };
    const handle = Authorization(authData);
    handle(TestClass);

    const meta = getRequestMeta(TestClass);

    expect(Object.isFrozen(meta.option.authorization)).toBe(true);
  });

  it('should handle complex nested authorization data', () => {
    class TestClass {}

    const complexAuth = {
      oauth: {
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-456',
        tokenType: 'Bearer',
        expiresIn: 3600,
      },
      apiKeys: ['key1', 'key2', 'key3'],
      metadata: {
        userId: 'user123',
        scopes: ['read', 'write', 'admin'],
      },
    };

    const handle = Authorization(complexAuth);
    handle(TestClass);

    const meta = getRequestMeta(TestClass);

    expect(meta.option.authorization).toEqual(complexAuth);
    expect(Object.isFrozen(meta.option.authorization)).toBe(true);
  });

  it('should override parent class authorization in inheritance hierarchy', () => {
    class ParentClass {}
    class ChildClass extends ParentClass {}

    const parentAuth = 'Bearer parent-token';
    const childAuth = { apiKey: 'child-key' };

    const parentHandle = Authorization(parentAuth);
    const childHandle = Authorization(childAuth);

    parentHandle(ParentClass);
    childHandle(ChildClass);

    const parentMeta = getRequestMeta(ParentClass);
    const childMeta = getRequestMeta(ChildClass);

    expect(parentMeta.option.authorization).toEqual(parentAuth);
    // Child should override parent's authorization
    expect(childMeta.option.authorization).toEqual(childAuth);
  });
});
