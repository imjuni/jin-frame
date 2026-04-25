import { renderHostFunc } from '#/renderers/renderHostFunc';
import { describe, expect, it } from 'vitest';

describe('renderHostFunc', () => {
  it('should return array host function when pass array hosts', () => {
    const result = renderHostFunc(['https://www.apple.com', 'https://www.google.com']);
    const expectation = `function getHost() {
    const hosts = [ 'https://www.apple.com', 'https://www.google.com' ];
    const host = hosts.at(0);
    if (host == null) {
        throw new Error('Cannot found host: undefined');
    }
    return host;
}`;
    expect(result).toEqual(expectation);
  });
});
