import { type OpenAPITSOptions, STRING, tsNullable } from "openapi-typescript";
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
        return isNullableSchema(schemaObject) ? tsNullable([STRING]) : STRING;
      }

      return undefined;
    },
  };
}
