import { Delete } from '#tools/decorators/methods/Delete';
import { describe, expect, it } from 'vitest';
import { getRequestMeta } from '#tools/decorators/methods/handlers/getRequestMeta';

class IamClass {}

describe('Delete', () => {
  it('should return configuration when pass custom content-type', () => {
    const contentType = 'custom content type';
    const hanlde = Delete({ contentType });
    hanlde(IamClass);

    const meta = getRequestMeta(IamClass);

    expect(meta.option.contentType).toEqual(contentType);
  });
});
