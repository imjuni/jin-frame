import { encodes } from '#tools/encodes/encodes';
import { describe, expect, it } from 'vitest';

describe('encodes', () => {
  it('should successfully encodes', () => {
    const encoded = encodes(true, ['a', 'b', 'c', '😄']);
    const expected = ['a', 'b', 'c', '%F0%9F%98%84'];
    expect(encoded).toEqual(expected);
  });
});
