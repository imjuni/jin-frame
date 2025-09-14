import { Query } from '#decorators/fields/Query';
import { describe, expect, it } from 'vitest';

describe('Query', () => {
  it('should return query decorator handle when pass option', () => {
    const hanlde = Query({ replaceAt: 'name' });
    expect(hanlde).toBeTruthy();
  });
});
