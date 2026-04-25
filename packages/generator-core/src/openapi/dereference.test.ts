import { describe, expect, it } from 'vitest';
import pathe from 'pathe';
import { load } from '#/openapi/load';
import { dereference } from '#/openapi/dereference';
import type { OpenAPIV3 } from 'openapi-types';

describe('dereference', () => {
  it('should return dereferenced openapi spec document when pass valid document', async () => {
    const dir = pathe.join(process.cwd(), '..', '..', 'examples', 'openapi');
    const file = pathe.join(dir, 'v3.json');
    const document = await load(file);

    const dereferenced = await dereference(document?.data as unknown as OpenAPIV3.Document);
    const result = JSON.stringify(dereferenced);

    expect(result.indexOf('$ref')).toBeLessThan(0);
  });
});
