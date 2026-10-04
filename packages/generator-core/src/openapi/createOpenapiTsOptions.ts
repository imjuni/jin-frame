import type { OpenAPITSOptions } from "openapi-typescript";
import ts from "typescript";
import type { ICreateOpenapiTsOptions } from "#openapi/interfaces/ICreateOpenapiTsOptions.js";
import { isInt64IntegerSchema } from "#openapi/isInt64IntegerSchema.js";
import { isNullableSchema } from "#openapi/isNullableSchema.js";

export function createOpenapiTsOptions(option: ICreateOpenapiTsOptions): OpenAPITSOptions {
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
        const stringType = ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
        return isNullableSchema(schemaObject)
          ? ts.factory.createUnionTypeNode([stringType, ts.factory.createLiteralTypeNode(ts.factory.createNull())])
          : stringType;
      }

      return undefined;
    },
  };
}
