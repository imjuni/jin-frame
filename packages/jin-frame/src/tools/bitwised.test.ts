import { bitwised } from '#tools/bitwised';
import { expect, it } from 'vitest';

it('bitwised.ts', () => {
  const bitwisedValue = bitwised([0b1, 0b1000, 0b10000]);
  const expected = 0b11001;
  expect(bitwisedValue).toEqual(expected);
});
