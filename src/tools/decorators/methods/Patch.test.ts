import { describe, expect, it } from 'vitest';
import { getRequestMeta } from '#tools/decorators/methods/handlers/getRequestMeta';
import { Patch } from '#tools/decorators/methods/Patch';

class IamClass {}

describe('Patch', () => {
  it('should return configuration when pass custom content-type', () => {
    const contentType = 'custom content type';
    const hanlde = Patch({ contentType });
    hanlde(IamClass);

    const meta = getRequestMeta(IamClass);

    expect(meta.option.contentType).toEqual(contentType);
  });
});
