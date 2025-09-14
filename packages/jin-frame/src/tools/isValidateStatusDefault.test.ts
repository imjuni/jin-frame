import { isValidateStatusDefault } from '#tools/isValidateStatusDefault';
import { describe, expect, it } from 'vitest';

describe('isValidateStatusDefault', () => {
  it('should successfully', () => {
    const result = isValidateStatusDefault(200);
    expect(result).toBeTruthy();
  });

  it('should fail', () => {
    const result = isValidateStatusDefault(400);
    expect(result).toBeFalsy();
  });
});
