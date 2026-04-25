import { mergeFrameOption } from '#tools/mergeFrameOption';
import type { FrameOption } from '#interfaces/options/FrameOption';
import { describe, expect, it } from 'vitest';

describe('mergeFrameOption', () => {
  const prev: FrameOption = {
    method: 'GET',
    host: 'https://api.site.com',
    contentType: 'application/json',
    useInstance: false,
  };

  const next: FrameOption = {
    method: 'POST',
    path: 'api-path/{name}',
    contentType: 'application/json',
    useInstance: false,
  };

  it('should merged value when overwrite method and merged host and path', () => {
    const merged = mergeFrameOption(structuredClone(prev), structuredClone(next));

    expect(merged).toEqual({
      method: 'POST',
      host: 'https://api.site.com',
      path: 'api-path/{name}',
      contentType: 'application/json',
      useInstance: false,
    });
  });
});
