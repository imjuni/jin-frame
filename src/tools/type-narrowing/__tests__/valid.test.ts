import 'jest';
import { isValidNumberArray } from '../isValidNumberArray';

describe('isValidNumberArray', () => {
  test('fail', () => {
    const r = isValidNumberArray('a');
    expect(r).toBeFalsy();
  });
});
