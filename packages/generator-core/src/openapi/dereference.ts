import $RefParser from '@apidevtools/json-schema-ref-parser';
import type { OpenAPIV3 } from 'openapi-types';

export async function dereference(document: OpenAPIV3.Document): Promise<OpenAPIV3.Document> {
  const dereferenced = await $RefParser.dereference<OpenAPIV3.Document>(document);
  return dereferenced;
}
