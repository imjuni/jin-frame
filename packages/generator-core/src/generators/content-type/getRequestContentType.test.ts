import { getRequestContentType } from '#/generators/content-type/getRequestContentType';
import { describe, expect, it } from 'vitest';

describe('getRequestContentType', () => {
  it('should return undefined when empty requestBody', () => {
    const result = getRequestContentType(undefined);
    expect(result).toBeUndefined();
  });

  it('should return application/json when match content', () => {
    const result = getRequestContentType({ content: { 'application/json': {} } });
    expect(result).toEqual('application/json');
  });
});
