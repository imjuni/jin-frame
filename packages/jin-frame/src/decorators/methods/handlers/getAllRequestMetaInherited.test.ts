import { describe, expect, it } from 'vitest';
import { getAllRequestMetaInherited } from '#decorators/methods/handlers/getAllMethodMetaInherited';
import { Get } from '#decorators/methods/Get';
import { Post } from '#decorators/methods/Post';
import { Patch } from '#decorators/methods/Patch';
import { Timeout } from '#decorators/methods/options/Timeout';
import { Retry } from '#decorators/methods/options/Retry';
import { Validator } from '#decorators/methods/options/Validator';
import { Security } from '#decorators/methods/options/Security';
import { BaseValidator } from '#validators/BaseValidator';
import { Put } from '#decorators/methods/Put';
import { BearerTokenProvider } from '#providers/security/BearerTokenProvider';
import { ApiKeyProvider } from '#providers/security/ApiKeyProvider';
import { BasicAuthProvider } from '#providers/security/BasicAuthProvider';

@Security(new BearerTokenProvider('base-auth'), 'Bearer base-token')
@Get({ host: 'http://some.host.com' })
class GetAllRequestMetaInheritedTest001 {}

@Security(new ApiKeyProvider('post-auth', 'X-API-Key', 'header'), 'post-api-key')
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
@Put({})
class GetAllRequestMetaInheritedTest004 extends GetAllRequestMetaInheritedTest003 {}

@Security([new BasicAuthProvider('final-auth'), new BearerTokenProvider('final-bearer')], 'final-session-token')
@Timeout(2000)
@Validator({ pass: new BaseValidator({ type: 'exception' }) })
@Get({ path: 'overwrite/double/path' })
class GetAllRequestMetaInheritedTest005 extends GetAllRequestMetaInheritedTest004 {}

describe('getAllRequestMetaInherited', () => {
  it('should collect methods from full inheritance chain', () => {
    const metas = getAllRequestMetaInherited(GetAllRequestMetaInheritedTest005);

    expect(metas).toMatchObject({
      methods: [
        {
          option: {
            contentType: 'application/json',
            method: 'GET',
            path: 'overwrite/double/path',
          },
        },
        {
          option: {
            method: 'PUT',
          },
        },
        {
          option: {
            method: 'PATCH',
            path: 'overwrite/path',
            contentType: 'custom-content-type',
          },
        },
        {
          option: {
            method: 'POST',
            path: 'some/path',
          },
        },
        {
          option: {
            host: 'http://some.host.com',
            method: 'GET',
          },
        },
      ],
      retries: [{ max: 2, interval: 500 }],
      timeouts: [2000, 3000, 1000],
      validators: [{ pass: new BaseValidator({ type: 'exception' }) }],
      dedupes: [],
      securities: [
        [new BasicAuthProvider('final-auth'), new BearerTokenProvider('final-bearer')],
        new ApiKeyProvider('patch-auth', 'X-API-Key', 'header'),
        new ApiKeyProvider('post-auth', 'X-API-Key', 'header'),
        new BearerTokenProvider('base-auth'),
      ],
      authorizations: ['final-session-token', 'post-api-key', 'Bearer base-token'],
    });
  });

  it('should handle Security with key in inheritance hierarchy', () => {
    @Security(new BearerTokenProvider('grandparent-auth'), 'grandparent-token')
    @Get({ host: 'https://api.example.com' })
    class GrandParentClass {}

    @Security(new ApiKeyProvider('parent-auth', 'X-API-Key', 'header'), 'parent-key')
    @Post({ path: '/api/v1' })
    class ParentClass extends GrandParentClass {}

    @Security([new BasicAuthProvider('child-auth'), new BearerTokenProvider('child-bearer')], 'child-session')
    @Put({ path: '/api/v2/resource' })
    class ChildClass extends ParentClass {}

    const metas = getAllRequestMetaInherited(ChildClass);

    expect(metas.securities).toEqual([
      [new BasicAuthProvider('child-auth'), new BearerTokenProvider('child-bearer')],
      new ApiKeyProvider('parent-auth', 'X-API-Key', 'header'),
      new BearerTokenProvider('grandparent-auth'),
    ]);

    expect(metas.authorizations).toEqual(['child-session', 'parent-key', 'grandparent-token']);

    expect(metas.methods).toHaveLength(3);
    expect(metas.methods.at(0)?.option.method).toBe('PUT');
    expect(metas.methods.at(1)?.option.method).toBe('POST');
    expect(metas.methods.at(2)?.option.method).toBe('GET');
  });

  it('should handle Security without key', () => {
    @Security(new BearerTokenProvider('base-security'))
    @Get({ host: 'https://base.example.com' })
    class BaseClass {}

    @Timeout(5000)
    @Post({ path: '/middle' })
    class MiddleClass extends BaseClass {}

    @Security([new ApiKeyProvider('final-key', 'X-Key', 'query'), new BasicAuthProvider('final-basic')], 'final-token')
    @Retry({ max: 3, interval: 1000 })
    @Patch({ path: '/final' })
    class FinalClass extends MiddleClass {}

    const metas = getAllRequestMetaInherited(FinalClass);

    expect(metas.securities).toEqual([
      [new ApiKeyProvider('final-key', 'X-Key', 'query'), new BasicAuthProvider('final-basic')],
      new BearerTokenProvider('base-security'),
    ]);

    expect(metas.authorizations).toEqual(['final-token']);

    expect(metas.retries).toEqual([{ max: 3, interval: 1000 }]);
    expect(metas.timeouts).toEqual([5000]);
  });

  it('should return empty authorizations when no key is provided', () => {
    @Get({ host: 'https://no-auth.example.com' })
    class NoAuthClass {}

    @Security(new BearerTokenProvider('only-security'))
    @Post({ path: '/only-security' })
    class OnlySecurityClass extends NoAuthClass {}

    const noAuthMetas = getAllRequestMetaInherited(NoAuthClass);
    expect(noAuthMetas.securities).toEqual([]);
    expect(noAuthMetas.authorizations).toEqual([]);

    const onlySecurityMetas = getAllRequestMetaInherited(OnlySecurityClass);
    expect(onlySecurityMetas.securities).toEqual([new BearerTokenProvider('only-security')]);
    expect(onlySecurityMetas.authorizations).toEqual([]);
  });

  it('should store function-based SecurityKey in authorizations', () => {
    const keyFn = () => 'dynamic-token';

    @Security(new BearerTokenProvider(), keyFn)
    @Get({ host: 'https://api.example.com' })
    class FnKeyClass {}

    const metas = getAllRequestMetaInherited(FnKeyClass);

    expect(metas.authorizations).toEqual([keyFn]);
    expect(typeof metas.authorizations[0]).toBe('function');
  });
});
