import { describe, expect, it } from 'vitest';
import { dotRelative } from '#/tools/dotRelative';

describe('dotRelative', () => {
  it('should add dot prefix when target is in same directory', () => {
    expect(dotRelative('/a/b', '/a/b/c')).toEqual('./c');
  });

  it('should keep existing dot prefix when target requires parent directory navigation', () => {
    expect(dotRelative('/a/b', '/a/d/c')).toEqual('../d/c');
  });
});
