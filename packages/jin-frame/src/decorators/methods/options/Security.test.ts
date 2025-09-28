import { describe, expect, it } from 'vitest';
import { getRequestMeta } from '#decorators/methods/handlers/getRequestMeta';
import { Security } from '#decorators/methods/options/Security';
import { BearerTokenProvider } from '#providers/security/BearerTokenProvider';
import { ApiKeyProvider } from '#providers/security/ApiKeyProvider';
import { BasicAuthProvider } from '#providers/security/BasicAuthProvider';

describe('Security', () => {
  it('should set security metadata correctly when Security decorator applied with single provider', () => {
    class TestClass {}

    const provider = new BearerTokenProvider('auth-bearer');
    const handle = Security(provider);
    handle(TestClass);

    const meta = getRequestMeta(TestClass);

    expect(meta.option.security).toEqual(provider);
  });

  it('should set security metadata correctly when Security decorator applied with multiple providers', () => {
    class TestClass {}

    const providers = [new BearerTokenProvider('auth-bearer'), new ApiKeyProvider('api-key', 'X-API-Key', 'header')];
    const handle = Security(providers);
    handle(TestClass);

    const meta = getRequestMeta(TestClass);

    expect(meta.option.security).toEqual(providers);
  });

  it('should support multiple security providers via array parameter', () => {
    class TestClass {}

    const provider1 = new BearerTokenProvider('auth-bearer');
    const provider2 = new ApiKeyProvider('api-key', 'X-API-Key', 'header');
    const provider3 = new BasicAuthProvider('basic-auth');

    // Proper way to use multiple security providers is via array
    const handle = Security([provider1, provider2, provider3]);
    handle(TestClass);

    const meta = getRequestMeta(TestClass);

    expect(meta.option.security).toEqual([provider1, provider2, provider3]);
  });

  it('should freeze security provider option to prevent mutation', () => {
    class TestClass {}

    const provider = new BearerTokenProvider('auth-bearer');
    const handle = Security(provider);
    handle(TestClass);

    const meta = getRequestMeta(TestClass);

    expect(Object.isFrozen(meta.option.security)).toBe(true);
  });

  it('should handle array of providers and freeze the array', () => {
    class TestClass {}

    const providers = [new BearerTokenProvider('auth-bearer'), new ApiKeyProvider('api-key', 'X-API-Key', 'header')];
    const handle = Security(providers);
    handle(TestClass);

    const meta = getRequestMeta(TestClass);

    expect(Object.isFrozen(meta.option.security)).toBe(true);
  });

  it('should override parent class security in inheritance hierarchy', () => {
    class ParentClass {}
    class ChildClass extends ParentClass {}

    const parentProvider = new BearerTokenProvider('parent-auth');
    const childProvider = new ApiKeyProvider('child-auth', 'X-API-Key', 'header');

    const parentHandle = Security(parentProvider);
    const childHandle = Security(childProvider);

    parentHandle(ParentClass);
    childHandle(ChildClass);

    const parentMeta = getRequestMeta(ParentClass);
    const childMeta = getRequestMeta(ChildClass);

    expect(parentMeta.option.security).toEqual(parentProvider);
    // Child should override parent's security
    expect(childMeta.option.security).toEqual(childProvider);
  });
});
