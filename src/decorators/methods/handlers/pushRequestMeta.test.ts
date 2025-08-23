import { describe, expect, it } from 'vitest';
import { getRequestMeta } from '#decorators/methods/handlers/getRequestMeta';
import { pushRequestMeta } from '#decorators/methods/handlers/pushRequestMeta';
import type { IFrameOption } from '#interfaces/options/IFrameOption';
import { getFrameOption } from '#decorators/getFrameOption';

class IamClass {}

describe('pushRequestMeta and getRequestMeta', () => {
  it('should return configuration when pass custom content-type', () => {
    const contentType = 'my-custom-content-type';
    const option: IFrameOption = getFrameOption('GET', { contentType });

    pushRequestMeta(IamClass, { option });
    const meta = getRequestMeta(IamClass);

    expect(meta.option.contentType).toEqual(contentType);
  });
});
