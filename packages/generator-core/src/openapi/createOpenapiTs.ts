import type { OpenAPIV3 } from 'openapi-types';
import type { OpenAPITSOptions, OpenAPI3 } from 'openapi-typescript';
import type { ts } from 'ts-morph';

export async function createOpenapiTs(
  document: OpenAPIV3.Document,
  option: OpenAPITSOptions,
): Promise<ts.Node[]> {
  const openapiTypescript = await import('openapi-typescript');
  const nodes = await openapiTypescript.default(document as OpenAPI3, option);
  return nodes;
}
