import { mergeFrameOption } from '#tools/mergeOption';
import type { IFrameOption } from '#interfaces/options/IFrameOption';
import { describe, expect, it } from 'vitest';

describe('mergeFrameOption', () => {
  const prev: IFrameOption = {
    method: 'GET',
    host: 'https://api.site.com',
    contentType: 'application/json',
    useInstance: false,
  };

  const next: IFrameOption = {
    method: 'POST',
    path: 'api-path/:name',
    contentType: 'application/json',
    useInstance: false,
  };

  it('should merged value when overwrite method and merged host and path', () => {
    const merged = mergeFrameOption(structuredClone(prev), structuredClone(next));

    expect(merged).toEqual({
      method: 'POST',
      host: 'https://api.site.com',
      path: 'api-path/:name',
      contentType: 'application/json',
      useInstance: false,
    });
  });
});
