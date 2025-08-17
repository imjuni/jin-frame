import { Param } from '#decorators/fields/Param';
import { describe, expect, it } from 'vitest';

describe('Param', () => {
  it('should return query decorator handle when pass option', () => {
    const hanlde = Param({ replaceAt: 'name' });
    expect(hanlde).toBeTruthy();
  });
});
