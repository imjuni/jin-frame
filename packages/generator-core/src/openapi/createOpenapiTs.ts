import type { OpenAPIV3 } from "openapi-types";
import type { OpenAPI3, OpenAPITSOptions } from "openapi-typescript";
import type ts from "typescript";

export async function createOpenapiTs(document: OpenAPIV3.Document, option: OpenAPITSOptions): Promise<ts.Node[]> {
  const openapiTypescript = await import("openapi-typescript");
  const nodes = await openapiTypescript.default(document as OpenAPI3, option);
  return nodes;
}
