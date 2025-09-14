import { removeStartSlash } from '#tools/slash-utils/removeStartSlash';
import { describe, expect, it } from 'vitest';

describe('removeStartSlash', () => {
  it('truthy case', () => {
    const removed = removeStartSlash('/test');
    const orgin = removeStartSlash('test');

    expect(removed).toEqual('test');
    expect(orgin).toEqual('test');
  });
});
