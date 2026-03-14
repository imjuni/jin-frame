import { load } from '#/openapi/load';
import { describe, it } from 'vitest';
import pathe from 'pathe';
import fs from 'node:fs';
import $RefParser from '@apidevtools/json-schema-ref-parser';
import type { OpenAPIV3 } from 'openapi-types';

describe('convertor', () => {
  it('', async () => {
    // const result = await load('./samples/v3.yml');
    const dir = pathe.join(process.cwd(), '..', '..', 'examples', 'openapi');
    const file = pathe.join(dir, 'v3.json');
    const document = await load(file);
    const dereferenced = await $RefParser.dereference<OpenAPIV3.Document>(document);

    await fs.promises.writeFile(pathe.join(dir, 'v3-2.json'), JSON.stringify(dereferenced, undefined, 2));
    console.log(dereferenced);
  });
});
