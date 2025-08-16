import { describe, expect, it } from 'vitest';
import { getRequestMeta } from '#tools/decorators/methods/handlers/getRequestMeta';
import { Post } from '#tools/decorators/methods/Post';

class IamClass {}

describe('Post', () => {
  it('should return configuration when pass custom content-type', () => {
    const contentType = 'custom content type';
    const hanlde = Post({ contentType });
    hanlde(IamClass);

    const meta = getRequestMeta(IamClass);

    expect(meta.option.contentType).toEqual(contentType);
  });
});
