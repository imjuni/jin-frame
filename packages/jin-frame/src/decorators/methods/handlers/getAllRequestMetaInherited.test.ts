import { describe, expect, it } from 'vitest';
import { getAllRequestMetaInherited } from '#decorators/methods/handlers/getAllMethodMetaInherited';
import { Get } from '#decorators/methods/Get';
import { Post } from '#decorators/methods/Post';
import { Patch } from '#decorators/methods/Patch';
import { Timeout } from '#decorators/methods/options/Timeout';
import { Retry } from '#decorators/methods/options/Retry';
import { Validator } from '#decorators/methods/options/Validator';
import { BaseValidator } from '#validators/BaseValidator';
import { Put } from '#decorators/methods/Put';

@Get({ host: 'http://some.host.com' })
class GetAllRequestMetaInheritedTest001 {}

@Post({ path: 'some/path' })
class GetAllRequestMetaInheritedTest002 extends GetAllRequestMetaInheritedTest001 {}

@Timeout(1000)
@Patch({
  contentType: 'custom-content-type',
  path: 'overwrite/path',
})
class GetAllRequestMetaInheritedTest003 extends GetAllRequestMetaInheritedTest002 {}

@Retry({ max: 2, interval: 500 })
@Timeout(3000)
@Put()
class GetAllRequestMetaInheritedTest004 extends GetAllRequestMetaInheritedTest003 {}

@Timeout(2000)
@Validator(new BaseValidator({ type: 'exception' }))
@Get({ path: 'overwrite/double/path' })
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
            pathPrefix: undefined,
            validator: undefined,
          },
        },
      ],
      retries: [{ max: 2, interval: 500 }],
      timeouts: [2000, 3000, 1000],
      validators: [new BaseValidator({ type: 'exception' })],
    });
  });
});
