import { describe, expect, it } from 'vitest';
import { BaseValidator } from '#validators/BaseValidator';

describe('Validator', () => {
  it('should create validator instance with correct type when constructor called with exception type', () => {
    const validator = new BaseValidator({ type: 'exception' });
    expect(validator).toBeDefined();
    expect(validator.type).toBe('exception');
  });

  it('should return original data when getData method called with input data', () => {
    const validator = new BaseValidator({ type: 'exception' });
    const data = validator.getData('name');
    expect(data).toBe('name');
  });

  it('should return valid result when validator method called with valid data', () => {
    const validator = new BaseValidator({ type: 'exception' });
    const data = validator.validator('name');
    expect(data).toEqual({ valid: true });
  });

  it('should return valid result when validate method called with valid data', async () => {
    const validator = new BaseValidator({ type: 'exception' });
    const data = await validator.validate('name');
    expect(data).toEqual({ valid: true });
  });
});
