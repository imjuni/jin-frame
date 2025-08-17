import { describe, expect, it } from 'vitest';
import { getAllRequestMetaInherited } from '#decorators/methods/handlers/getAllMethodMetaInherited';
import { Get } from '#decorators/methods/Get';
import { Post } from '#decorators/methods/Post';
import { Patch } from '#decorators/methods/Patch';

@Get({ host: 'http://some.host.com' })
class GetAllRequestMetaInheritedTest001 {}

@Post({ path: 'some/path' })
class GetAllRequestMetaInheritedTest002 extends GetAllRequestMetaInheritedTest001 {}

@Patch({ path: 'overwrite/path', contentType: 'custom-content-type' })
class GetAllRequestMetaInheritedTest003 extends GetAllRequestMetaInheritedTest002 {}

describe('getAllRequestMetaInherited', () => {
  it('should return configuration when pass custom content-type', () => {
    const metas = getAllRequestMetaInherited(GetAllRequestMetaInheritedTest003);

    expect(metas).toMatchObject([
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
        },
        data: {
          query: {},
          header: {},
          param: {},
          body: undefined,
          retry: undefined,
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
        },
        data: {
          query: {},
          header: {},
          param: {},
          body: undefined,
          retry: undefined,
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
        },
        data: {
          query: {},
          header: {},
          param: {},
          body: undefined,
          retry: undefined,
        },
      },
    ]);
  });
});
