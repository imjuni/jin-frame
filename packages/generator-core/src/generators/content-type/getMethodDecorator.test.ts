import { getMethodDecorator } from '#/generators/content-type/getMethodDecorator';
import { describe, expect, it } from 'vitest';

describe('getMethodDecorator', () => {
  it('should return decorator when empty content-type', () => {
    const decorator = getMethodDecorator({ host: 'host', path: 'path', method: 'Get' });
    expect(decorator).toEqual({
      name: 'Get',
      kind: 7,
      arguments: ["{ host: 'host', path: 'path' }"],
    });
  });

  it('should return decorator when empty content-type', () => {
    const decorator = getMethodDecorator({
      host: 'host',
      path: 'path',
      method: 'Get',
      contentType: 'application/x-www-form-urlencoded',
    });
    expect(decorator).toEqual({
      name: 'Get',
      kind: 7,
      arguments: ["{ host: 'host', path: 'path', contentType: 'application/x-www-form-urlencoded' }"],
    });
  });
});
