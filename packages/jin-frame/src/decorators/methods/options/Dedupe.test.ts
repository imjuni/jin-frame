import { describe, expect, it } from 'vitest';
import { getRequestMeta } from '#decorators/methods/handlers/getRequestMeta';
import { Dedupe } from '#decorators/methods/options/Dedupe';

class IamClass {}

describe('Dedupe', () => {
  it('should set timeout metadata correctly when Timeout decorator applied to class', () => {
    const hanlde = Dedupe();
    hanlde(IamClass);

    const meta = getRequestMeta(IamClass);

    expect(meta.option.dedupe).toEqual(true);
  });
});
