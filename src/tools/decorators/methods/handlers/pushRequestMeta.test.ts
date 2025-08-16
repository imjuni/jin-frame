import { describe, expect, it } from 'vitest';
import { getRequestMeta } from '#tools/decorators/methods/handlers/getRequestMeta';
import { pushRequestMeta } from '#tools/decorators/methods/handlers/pushRequestMeta';
import type { IFrameOption } from '#tools/type-utilities/IFrameOption';
import type { IFrameInternal } from '#tools/type-utilities/IFrameInternal';
import { getFrameOption } from '#tools/decorators/getFrameOption';
import { getFrameInternalData } from '#tools/decorators/getFrameInternalData';

class IamClass {}

describe('pushRequestMeta and getRequestMeta', () => {
  it('should return configuration when pass custom content-type', () => {
    const contentType = 'my-custom-content-type';
    const option: IFrameOption = getFrameOption('GET', { contentType });
    const data: IFrameInternal = getFrameInternalData(option);

    pushRequestMeta(IamClass, { option, data });
    const meta = getRequestMeta(IamClass);

    expect(meta.option.contentType).toEqual(contentType);
  });
});
