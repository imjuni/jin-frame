import { describe, expect, it } from 'vitest';
import { getRequestMeta } from '#decorators/methods/handlers/getRequestMeta';
import { Timeout } from '#decorators/methods/options/Timeout';

class IamClass {}

describe('Timeout', () => {
  it('should set timeout metadata correctly when Timeout decorator applied to class', () => {
    const timeout = 1000;
    const hanlde = Timeout(timeout);
    hanlde(IamClass);

    const meta = getRequestMeta(IamClass);

    expect(meta.option.timeout).toEqual(timeout);
  });
});
