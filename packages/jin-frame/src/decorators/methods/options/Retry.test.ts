import { describe, expect, it } from 'vitest';
import { getRequestMeta } from '#decorators/methods/handlers/getRequestMeta';
import { Retry } from '#decorators/methods/options/Retry';

class IamClass {}

describe('Retry', () => {
  it('should set retry metadata correctly when Retry decorator applied to class', () => {
    const retry = { max: 2, interval: 1000 };
    const hanlde = Retry(retry);
    hanlde(IamClass);

    const meta = getRequestMeta(IamClass);

    expect(meta.option.retry).toEqual(retry);
  });
});
