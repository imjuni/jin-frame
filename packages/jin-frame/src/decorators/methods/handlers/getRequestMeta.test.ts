import { describe, expect, it } from 'vitest';
import { Post } from '#decorators/methods/Post';
import { JinFrame } from '#frames/JinFrame';
import { getRequestMeta } from '#decorators/methods/handlers/getRequestMeta';
import { Retry } from '#decorators/methods/options/Retry';
import { Timeout } from '#decorators/methods/options/Timeout';

const getInterval = () => 500;

@Post({ host: 'https://api.someapi.com' })
class IamPostRequest001 {}

class IamPostRequest002 extends JinFrame {}

@Retry({ max: 2, interval: 1000 })
@Post({ host: 'https://api.someapi.com' })
class IamPostRequest003 extends JinFrame {}

@Retry({ max: 3, interval: 500 })
@Post({ host: 'https://api.someapi.com' })
class IamPostRequest004 extends IamPostRequest003 {}

@Timeout(1000)
@Retry({ max: 3, getInterval })
@Post({ host: 'https://api.someapi.com' })
class IamPostRequest005 extends IamPostRequest004 {}

@Timeout(3000)
@Retry({ max: 2, getInterval })
@Post({ host: 'https://api.someapi.com' })
class IamPostRequest006 extends IamPostRequest005 {}

describe('getRequestMeta', () => {
  it('should return basic metadata when only Post decorator is applied', () => {
    const meta = getRequestMeta(IamPostRequest001);

    expect(meta.option).toEqual({
      host: 'https://api.someapi.com',
      method: 'POST',
      contentType: 'application/json',
    });
  });

  it('should return retry configuration when Retry decorator is applied', () => {
    const meta = getRequestMeta(IamPostRequest003);

    expect(meta.option).toEqual({
      host: 'https://api.someapi.com',
      method: 'POST',
      contentType: 'application/json',
      retry: { max: 2, interval: 1000 },
    });
  });

  it('should override parent retry configuration when child class has different Retry decorator', () => {
    const meta = getRequestMeta(IamPostRequest004);

    expect(meta.option).toEqual({
      host: 'https://api.someapi.com',
      method: 'POST',
      contentType: 'application/json',
      retry: { max: 3, interval: 500 },
    });
  });

  it('should merge retry with getInterval and timeout when both decorators are applied', () => {
    const meta = getRequestMeta(IamPostRequest005);

    expect(meta.option).toEqual({
      host: 'https://api.someapi.com',
      method: 'POST',
      contentType: 'application/json',
      retry: { max: 3, interval: 500, getInterval },
      timeout: 1000,
    });
  });

  it('should apply final merged configuration when multiple decorators are inherited and overridden', () => {
    const meta = getRequestMeta(IamPostRequest006);

    expect(meta.option).toEqual({
      host: 'https://api.someapi.com',
      method: 'POST',
      contentType: 'application/json',
      retry: { max: 2, interval: 500, getInterval },
      timeout: 3000,
    });
  });

  it('should throw error when class has no request decorator metadata', () => {
    expect(() => {
      getRequestMeta(IamPostRequest002);
    }).toThrowError();
  });
});
