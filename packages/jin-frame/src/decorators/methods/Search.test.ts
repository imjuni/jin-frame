import { describe, expect, it } from 'vitest';
import { getRequestMeta } from '#decorators/methods/handlers/getRequestMeta';
import { Search } from '#decorators/methods/Search';

class IamClass {}

describe('Search', () => {
  it('should return configuration when pass custom content-type', () => {
    const contentType = 'custom content type';
    const hanlde = Search({ contentType });
    hanlde(IamClass);

    const meta = getRequestMeta(IamClass);

    expect(meta.option.contentType).toEqual(contentType);
  });
});
