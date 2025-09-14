import { describe, expect, it } from 'vitest';
import { safePathJoin } from '#/tools/safePathJoin';

describe('safePathJoin', () => {
  it('should join all string arguments when all arguments are strings', () => {
    expect(safePathJoin('a', 'b', 'c')).toEqual('a/b/c');
  });

  it('should filter out undefined values when joining paths', () => {
    expect(safePathJoin('a', undefined, 'c')).toEqual('a/c');
  });

  it('should filter out non-string values when joining paths', () => {
    expect(safePathJoin('a', 2, 'c')).toEqual('a/c');
  });
});
