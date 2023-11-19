import { describe, expect, it } from 'vitest';
import { isValidNumberArray } from '../isValidNumberArray';

describe('isValidNumberArray', () => {
  it('fail', () => {
    const r = isValidNumberArray('a');
    expect(r).toBeFalsy();
  });
});
