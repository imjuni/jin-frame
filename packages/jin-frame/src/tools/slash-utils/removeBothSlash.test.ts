import { removeBothSlash } from '#tools/slash-utils/removeBothSlash';
import { describe, expect, it } from 'vitest';

describe('removeBothSlash', () => {
  it('truthy case', () => {
    const removed = removeBothSlash('/test/');
    const orgin = removeBothSlash('test');

    expect(removed).toEqual('test');
    expect(orgin).toEqual('test');
  });
});
