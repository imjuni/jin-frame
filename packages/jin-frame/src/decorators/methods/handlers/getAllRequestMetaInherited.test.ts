import { describe, expect, it } from 'vitest';
import { getAllRequestMetaInherited } from '#decorators/methods/handlers/getAllMethodMetaInherited';
import { Get } from '#decorators/methods/Get';
import { Post } from '#decorators/methods/Post';
import { Patch } from '#decorators/methods/Patch';
import { Timeout } from '#decorators/methods/options/Timeout';
import { Retry } from '#decorators/methods/options/Retry';
import { Validator } from '#decorators/methods/options/Validator';
import { Security } from '#decorators/methods/options/Security';
import { Authorization } from '#decorators/methods/options/Authorization';
import { BaseValidator } from '#validators/BaseValidator';
import { Put } from '#decorators/methods/Put';
import { BearerTokenProvider } from '#providers/security/BearerTokenProvider';
import { ApiKeyProvider } from '#providers/security/ApiKeyProvider';
import { BasicAuthProvider } from '#providers/security/BasicAuthProvider';

@Security(new BearerTokenProvider('base-auth'))
@Authorization('Bearer base-token')
@Get({ host: 'http://some.host.com' })
class GetAllRequestMetaInheritedTest001 {}

@Authorization({ apiKey: 'post-api-key' })
@Post({ path: 'some/path' })
class GetAllRequestMetaInheritedTest002 extends GetAllRequestMetaInheritedTest001 {}

@Security(new ApiKeyProvider('patch-auth', 'X-API-Key', 'header'))
@Timeout(1000)
@Patch({
  contentType: 'custom-content-type',
  path: 'overwrite/path',
})
class GetAllRequestMetaInheritedTest003 extends GetAllRequestMetaInheritedTest002 {}

@Retry({ max: 2, interval: 500 })
@Timeout(3000)
@Put({ authoriztion: 'i-am-authorization-key' })
class GetAllRequestMetaInheritedTest004 extends GetAllRequestMetaInheritedTest003 {}

@Security([new BasicAuthProvider('final-auth'), new BearerTokenProvider('final-bearer')])
@Authorization({ sessionId: 'final-session', userId: 'final-user' })
@Timeout(2000)
@Validator(new BaseValidator({ type: 'exception' }))
@Get({ path: 'overwrite/double/path', authoriztion: 'i-am-authorization-key' })
class GetAllRequestMetaInheritedTest005 extends GetAllRequestMetaInheritedTest004 {}

describe('getAllRequestMetaInherited', () => {
  it('should return configuration when pass custom content-type', () => {
    const metas = getAllRequestMetaInherited(GetAllRequestMetaInheritedTest005);

    expect(metas).toMatchObject({
      methods: [
        {
          option: {
            contentType: 'application/json',
            customBody: undefined,
            host: undefined,
            method: 'GET',
            path: 'overwrite/double/path',
            retry: undefined,
            timeout: undefined,
            transformRequest: undefined,
            useInstance: false,
            userAgent: undefined,
            authoriztion: 'i-am-authorization-key',
            pathPrefix: undefined,
            validator: undefined,
          },
        },
        {
          option: {
            contentType: 'application/json',
            customBody: undefined,
            host: undefined,
            method: 'PUT',
            path: undefined,
            pathPrefix: undefined,
            retry: undefined,
            timeout: undefined,
            transformRequest: undefined,
            useInstance: false,
            userAgent: undefined,
            validator: undefined,
          },
        },
        {
          option: {
            host: undefined,
            path: 'overwrite/path',
            method: 'PATCH',
            customBody: undefined,
            transformRequest: undefined,
            useInstance: false,
            contentType: 'custom-content-type',
            userAgent: undefined,
            retry: undefined,
            timeout: undefined,
            authoriztion: undefined,
            pathPrefix: undefined,
            validator: undefined,
          },
        },
        {
          option: {
            host: undefined,
            path: 'some/path',
            method: 'POST',
            customBody: undefined,
            transformRequest: undefined,
            useInstance: false,
            contentType: 'application/json',
            userAgent: undefined,
            retry: undefined,
            timeout: undefined,
            authoriztion: undefined,
            pathPrefix: undefined,
            validator: undefined,
          },
        },
        {
          option: {
            host: 'http://some.host.com',
            path: undefined,
            method: 'GET',
            customBody: undefined,
            transformRequest: undefined,
            useInstance: false,
            contentType: 'application/json',
            userAgent: undefined,
            retry: undefined,
            timeout: undefined,
            authoriztion: undefined,
            pathPrefix: undefined,
            validator: undefined,
          },
        },
      ],
      retries: [{ max: 2, interval: 500 }],
      timeouts: [2000, 3000, 1000],
      validators: [new BaseValidator({ type: 'exception' })],
      dedupes: [],
      securities: [
        [new BasicAuthProvider('final-auth'), new BearerTokenProvider('final-bearer')],
        new ApiKeyProvider('patch-auth', 'X-API-Key', 'header'),
        new BearerTokenProvider('base-auth'),
      ],
      authorizations: [
        { sessionId: 'final-session', userId: 'final-user' },
        { apiKey: 'post-api-key' },
        'Bearer base-token',
      ],
    });
  });

  it('should handle Security and Authorization inheritance correctly', () => {
    // Test inheritance hierarchy for Security and Authorization
    @Security(new BearerTokenProvider('grandparent-auth'))
    @Authorization('Bearer grandparent-token')
    @Get({ host: 'https://api.example.com' })
    class GrandParentClass {}

    @Security(new ApiKeyProvider('parent-auth', 'X-API-Key', 'header'))
    @Authorization({ apiKey: 'parent-key', scope: 'read' })
    @Post({ path: '/api/v1' })
    class ParentClass extends GrandParentClass {}

    @Security([new BasicAuthProvider('child-auth'), new BearerTokenProvider('child-bearer')])
    @Authorization({ sessionId: 'child-session', permissions: ['read', 'write'] })
    @Put({ path: '/api/v2/resource' })
    class ChildClass extends ParentClass {}

    const metas = getAllRequestMetaInherited(ChildClass);

    expect(metas.securities).toEqual([
      [new BasicAuthProvider('child-auth'), new BearerTokenProvider('child-bearer')],
      new ApiKeyProvider('parent-auth', 'X-API-Key', 'header'),
      new BearerTokenProvider('grandparent-auth'),
    ]);

    expect(metas.authorizations).toEqual([
      { sessionId: 'child-session', permissions: ['read', 'write'] },
      { apiKey: 'parent-key', scope: 'read' },
      'Bearer grandparent-token',
    ]);

    expect(metas.methods).toHaveLength(3);
    expect(metas.methods.at(0)?.option.method).toBe('PUT');
    expect(metas.methods.at(1)?.option.method).toBe('POST');
    expect(metas.methods.at(2)?.option.method).toBe('GET');
  });

  it('should handle Security and Authorization with mixed decorators', () => {
    @Security(new BearerTokenProvider('base-security'))
    @Get({ host: 'https://base.example.com' })
    class BaseClass {}

    @Authorization({ token: 'middle-auth' })
    @Timeout(5000)
    @Post({ path: '/middle' })
    class MiddleClass extends BaseClass {}

    @Security([new ApiKeyProvider('final-key', 'X-Key', 'query'), new BasicAuthProvider('final-basic')])
    @Authorization('Bearer final-token')
    @Retry({ max: 3, interval: 1000 })
    @Patch({ path: '/final' })
    class FinalClass extends MiddleClass {}

    const metas = getAllRequestMetaInherited(FinalClass);

    expect(metas.securities).toEqual([
      [new ApiKeyProvider('final-key', 'X-Key', 'query'), new BasicAuthProvider('final-basic')],
      new BearerTokenProvider('base-security'),
    ]);

    expect(metas.authorizations).toEqual(['Bearer final-token', { token: 'middle-auth' }]);

    expect(metas.retries).toEqual([{ max: 3, interval: 1000 }]);
    expect(metas.timeouts).toEqual([5000]);
  });

  it('should handle empty Security and Authorization arrays correctly', () => {
    @Get({ host: 'https://no-auth.example.com' })
    class NoAuthClass {}

    @Security(new BearerTokenProvider('only-security'))
    @Post({ path: '/only-security' })
    class OnlySecurityClass extends NoAuthClass {}

    @Authorization('Bearer only-auth')
    @Put({ path: '/only-auth' })
    class OnlyAuthClass extends OnlySecurityClass {}

    const noAuthMetas = getAllRequestMetaInherited(NoAuthClass);
    expect(noAuthMetas.securities).toEqual([]);
    expect(noAuthMetas.authorizations).toEqual([]);

    const onlySecurityMetas = getAllRequestMetaInherited(OnlySecurityClass);
    expect(onlySecurityMetas.securities).toEqual([new BearerTokenProvider('only-security')]);
    expect(onlySecurityMetas.authorizations).toEqual([]);

    const onlyAuthMetas = getAllRequestMetaInherited(OnlyAuthClass);
    expect(onlyAuthMetas.securities).toEqual([new BearerTokenProvider('only-security')]);
    expect(onlyAuthMetas.authorizations).toEqual(['Bearer only-auth']);
  });
});
