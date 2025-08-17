import { describe, expect, it } from 'vitest';
import { Get } from '#decorators/methods/Get';
import { Delete } from '#decorators/methods/Delete';
import { getRequestMeta } from '#decorators/methods/handlers/getRequestMeta';

class IamGet01Class {}

class IamGet02Class {}

@Delete({ host: 'i-am-host' })
class IamDecorateParentGetClass {}

class IamDecorateChildGetClass extends IamDecorateParentGetClass {}

describe('Get', () => {
  it('should return configuration when pass custom content-type', () => {
    const contentType = 'custom content type';
    const hanlde = Get({ contentType });
    hanlde(IamGet01Class);

    const meta = getRequestMeta(IamGet01Class);

    expect(meta.option.contentType).toEqual(contentType);
  });

  it('should return merged configuration when double decorate', () => {
    const getContentType = 'custom content type - GET';
    const deleteContentType = 'custom content type - DELETE';

    const deleteHanlde = Delete({ contentType: deleteContentType });
    const getHanlde = Get({ contentType: getContentType });

    // Real Code
    //
    // @Delete
    // @Get
    // class IamGetClass {}
    deleteHanlde(IamGet02Class);
    getHanlde(IamGet02Class);

    const meta = getRequestMeta(IamGet02Class);

    expect(meta.option.contentType).toEqual(deleteContentType);
  });

  it('should return merge configuration child and parent when hierarchy classes', () => {
    const contentType = 'custom content type';
    const getHanlde = Get({ contentType, path: 'i-am-path' });
    getHanlde(IamDecorateChildGetClass);

    const meta = getRequestMeta(IamDecorateChildGetClass);

    expect(meta.option.contentType).toEqual(contentType);
  });
});
