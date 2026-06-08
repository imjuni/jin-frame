import type { OpenAPIV3 } from "openapi-types";
import type { OpenAPI3, OpenAPITSOptions } from "openapi-typescript";
import ts from "typescript";

export interface ICreateOpenapiTsOptions extends OpenAPITSOptions {
  int64AsString?: boolean;
}

function isInt64IntegerSchema(schemaObject: unknown): boolean {
  if (schemaObject == null || typeof schemaObject !== "object" || Array.isArray(schemaObject)) {
    return false;
  }

  const schema = schemaObject as Record<string, unknown>;
  const format = typeof schema.format === "string" ? schema.format.toLowerCase() : undefined;

  return schema.type === "integer" && (format === "int64" || format === "i64");
}

function createOpenapiTsOptions(option: ICreateOpenapiTsOptions): OpenAPITSOptions {
  const { int64AsString, transform, ...openapiTypescriptOptions } = option;

  if (int64AsString !== true) {
    return { ...openapiTypescriptOptions, transform };
  }

  return {
    ...openapiTypescriptOptions,
    transform: (schemaObject, options) => {
      const transformed = transform?.(schemaObject, options);

      if (transformed != null) {
        return transformed;
      }

      if (isInt64IntegerSchema(schemaObject)) {
        return ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
      }

      return undefined;
    },
  };
}

export async function createOpenapiTs(
  document: OpenAPIV3.Document,
  option: ICreateOpenapiTsOptions,
): Promise<ts.Node[]> {
  const openapiTypescript = await import("openapi-typescript");
  const nodes = await openapiTypescript.default(document as OpenAPI3, createOpenapiTsOptions(option));
  return nodes;
}
