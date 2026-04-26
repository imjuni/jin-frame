import { describe, expect, it } from 'vitest';
import { getRequestMeta } from '#decorators/methods/handlers/getRequestMeta';
import { Validator } from '#decorators/methods/options/Validator';
import { BaseValidator } from '#validators/BaseValidator';

class IamClass {}

describe('Validator', () => {
  it('should set validators metadata correctly when Validator decorator applied to class', () => {
    const validator = new BaseValidator({ type: 'exception' });
    const handle = Validator({ pass: validator });
    handle(IamClass);

    const meta = getRequestMeta(IamClass);

    expect(meta.option.validators).toEqual({ pass: validator });
  });
});
