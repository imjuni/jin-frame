import { getBodyDecorator } from '#/generators/parameters/getBodyDecorator';
import { describe, expect, it } from 'vitest';

describe('getBodyDecorator', () => {
  it('should return Body decorator', () => {
    const decorator = getBodyDecorator('Body');
    expect(decorator).toEqual([{ name: 'Body', arguments: [] }]);
  });

  it('should return ObjectBody decorator', () => {
    const decorator = getBodyDecorator('ObjectBody');
    expect(decorator).toEqual([{ name: 'ObjectBody', arguments: [] }]);
  });
});
