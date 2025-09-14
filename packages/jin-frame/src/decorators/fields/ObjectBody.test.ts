import { ObjectBody } from '#decorators/fields/ObjectBody';
import { describe, expect, it } from 'vitest';

describe('ObjectBody', () => {
  it('should return query decorator handle when pass option', () => {
    const hanlde = ObjectBody({ order: 1 });
    expect(hanlde).toBeTruthy();
  });
});
