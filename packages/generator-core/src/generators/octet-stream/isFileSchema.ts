import type { OpenAPIV3 } from "openapi-types";
import type { IIsFileSchemaResult } from "#generators/octet-stream/interfaces/IIsFileSchemaResult.js";

export function isFileSchema(_schema?: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject): IIsFileSchemaResult {
  const schema = _schema as OpenAPIV3.SchemaObject | undefined;

  if (schema == null) {
    return { isArray: false, isFile: false };
  }

  // Single file.
  if (schema.type === "string" && (schema.format === "binary" || schema.format === "byte")) {
    return { isArray: false, isFile: true };
  }

  // File array.
  if (schema.type === "array" && schema.items) {
    const item = schema.items as OpenAPIV3.SchemaObject;

    if (item.type === "string" && (item.format === "binary" || item.format === "byte")) {
      return { isArray: true, isFile: true };
    }

    return { isArray: true, isFile: false };
  }

  return { isArray: false, isFile: false };
}
