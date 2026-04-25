import { load } from '#/openapi/load';
import { convertor } from '#/openapi/convertor';
import { describe, expect, it } from 'vitest';
import type { OpenAPIV3, OpenAPIV2 } from 'openapi-types';
import pathe from 'pathe';

describe('convertor', () => {
  it('should return openapi v3 document when pass openapi v2 document', async () => {
    const dir = pathe.join(process.cwd(), '..', '..', 'examples', 'openapi');
    const fileV3 = pathe.join(dir, 'v3-from-v2.json');
    const fileV2 = pathe.join(dir, 'v2.json');
    const loadedV2 = await load(fileV2);
    const loadedV3 = await load(fileV3);
    const documentV2 = loadedV2?.data as unknown as OpenAPIV2.Document;
    const documentV3 = loadedV3?.data as unknown as OpenAPIV3.Document;

    const result = await convertor({ valid: true, version: 2, document: documentV2, errors: [] });

    expect(result).toMatchObject(documentV3);
  });

  it('should return openapi v3 document when pass openapi v3 document', async () => {
    const dir = pathe.join(process.cwd(), '..', '..', 'examples', 'openapi');
    const fileV3 = pathe.join(dir, 'v3-from-v2.json');
    const loadedV3 = await load(fileV3);
    const documentV3 = loadedV3?.data as unknown as OpenAPIV3.Document;

    const result = await convertor({ valid: true, version: 3, document: documentV3, errors: [] });

    expect(result).toMatchObject({ valid: true, version: 3, document: documentV3, errors: [] });
  });
});
