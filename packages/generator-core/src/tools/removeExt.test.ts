import { describe, expect, it } from 'vitest';
import { removeExt } from '#/tools/removeExt';

describe('removeExt', () => {
  it('should remove double extension when file has .d.ts extension', () => {
    expect(removeExt('test.d.ts')).toEqual('test');
  });

  it('should remove single extension when file has regular extension', () => {
    expect(removeExt('test.js')).toEqual('test');
  });
});
