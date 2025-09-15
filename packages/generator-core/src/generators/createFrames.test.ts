/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createFrames } from '#/generators/createFrames';
import { describe, it } from 'vitest';

describe('createFrames', async () => {
  // @ts-expect-error
  const document = await import('../../../../examples/openapi/v3.json');

  it('should return variety frame when pass v3 document', async () => {
    const frames = await createFrames({
      specTypeFilePath: '/a/b/c',
      host: 'https://pokeapi.co',
      output: '/a/b',
      useCodeFence: true,
      document,
    });
    console.log(frames);
  });
});
