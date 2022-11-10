/* eslint-disable max-classes-per-file, no-console */

import { bitwised } from '@tools/bitwised';
import { encodes } from '@tools/encode';

test('encodes.ts', () => {
  const encoded = encodes(true, ['a', 'b', 'c', '😄']);
  const expected = ['a', 'b', 'c', '%F0%9F%98%84'];
  expect(encoded).toEqual(expected);
});

test('bitwised.ts', () => {
  const bitwisedValue = bitwised([0b1, 0b1000, 0b10000]);
  const expected = 0b11001;
  expect(bitwisedValue).toEqual(expected);
});
