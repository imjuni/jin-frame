import { Header } from '#decorators/fields/Header';
import { describe, expect, it } from 'vitest';

describe('Header', () => {
  it('should return query decorator handle when pass option', () => {
    const hanlde = Header({ replaceAt: 'name' });
    expect(hanlde).toBeTruthy();
  });
});
