import { startWithSlash } from '#tools/slash-utils/startWithSlash';
import { describe, expect, it } from 'vitest';

describe('startWithSlash', () => {
  it('truthy case', () => {
    const removed = startWithSlash('/test');
    const orgin = startWithSlash('test');

    expect(removed).toEqual('/test');
    expect(orgin).toEqual('/test');
  });
});
