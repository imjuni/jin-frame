import { describe, expect, it } from 'vitest';
import { getRequestMeta } from '#decorators/methods/handlers/getRequestMeta';
import { Purge } from '#decorators/methods/Purge';

class IamClass {}

describe('Purge', () => {
  it('should return configuration when pass custom content-type', () => {
    const contentType = 'custom content type';
    const hanlde = Purge({ contentType });
    hanlde(IamClass);

    const meta = getRequestMeta(IamClass);

    expect(meta.option.contentType).toEqual(contentType);
  });
});
