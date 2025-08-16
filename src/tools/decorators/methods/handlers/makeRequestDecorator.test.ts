import { describe, expect, it } from 'vitest';
import { makeRequestDecorator } from '#tools/decorators/methods/handlers/makeRequestDecorator';

describe('makeRequestDecorator', () => {
  it('should return configuration when pass custom content-type', () => {
    const decorator = makeRequestDecorator('GET');

    expect(decorator).toBeTruthy();
  });
});
