import { describe, expect, it } from 'vitest';
import { getRequestMeta } from '#tools/decorators/methods/handlers/getRequestMeta';
import { Options } from '#tools/decorators/methods/Options';

class IamClass {}

describe('Options', () => {
  it('should return configuration when pass custom content-type', () => {
    const contentType = 'custom content type';
    const hanlde = Options({ contentType });
    hanlde(IamClass);

    const meta = getRequestMeta(IamClass);

    expect(meta.option.contentType).toEqual(contentType);
  });
});
