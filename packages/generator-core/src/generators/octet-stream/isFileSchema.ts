import type { OpenAPIV3 } from "openapi-types";
import type { IIsFileSchemaResult } from "#generators/octet-stream/interfaces/IIsFileSchemaResult.js";

export function isFileSchema(_schema?: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject): IIsFileSchemaResult {
  const schema = _schema as (OpenAPIV3.SchemaObject & { type?: string | string[] }) | undefined;

  if (schema == null) {
    return { isArray: false, isFile: false };
  }

  // Single file.
  const types = Array.isArray(schema.type) ? schema.type : [schema.type];
  if (types.includes("string") && (schema.format === "binary" || schema.format === "byte")) {
    return { isArray: false, isFile: true };
  }

  // File array.
  const items = "items" in schema ? schema.items : undefined;
  if (types.includes("array") && items) {
    const item = items as OpenAPIV3.SchemaObject & { type?: string | string[] };
    const itemTypes = Array.isArray(item.type) ? item.type : [item.type];

    if (itemTypes.includes("string") && (item.format === "binary" || item.format === "byte")) {
      return { isArray: true, isFile: true };
    }

    return { isArray: true, isFile: false };
  }

  return { isArray: false, isFile: false };
}
