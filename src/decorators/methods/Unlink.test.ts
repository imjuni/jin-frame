import { describe, expect, it } from 'vitest';
import { getRequestMeta } from '#decorators/methods/handlers/getRequestMeta';
import { Unlink } from '#decorators/methods/Unlink';

class IamClass {}

describe('Unlink', () => {
  it('should return configuration when pass custom content-type', () => {
    const contentType = 'custom content type';
    const hanlde = Unlink({ contentType });
    hanlde(IamClass);

    const meta = getRequestMeta(IamClass);

    expect(meta.option.contentType).toEqual(contentType);
  });
});
