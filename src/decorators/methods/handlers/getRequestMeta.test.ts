import { describe, expect, it } from 'vitest';
import { Post } from '#decorators/methods/Post';
import { JinFrame } from '#frames/JinFrame';
import { getRequestMeta } from '#decorators/methods/handlers/getRequestMeta';

@Post({ host: 'https://api.someapi.com' })
class IamPostRequest001 {}

class IamPostRequest002 extends JinFrame {}

describe('getRequestMeta', () => {
  it('should return configuration when pass minimum option', () => {
    const meta = getRequestMeta(IamPostRequest001);

    expect(meta.option).toEqual({
      host: 'https://api.someapi.com',
      path: undefined,
      method: 'POST',
      customBody: undefined,
      transformRequest: undefined,
      useInstance: false,
      contentType: 'application/json',
      userAgent: undefined,
      retry: undefined,
      timeout: undefined,
    });
  });

  it('should raise error when dont pass configuration', () => {
    expect(() => {
      getRequestMeta(IamPostRequest002);
    }).toThrowError();
  });
});
