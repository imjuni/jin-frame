export function isInt64IntegerSchema(schemaObject: unknown): boolean {
  if (schemaObject == null || typeof schemaObject !== "object" || Array.isArray(schemaObject)) {
    return false;
  }

  const schema = schemaObject as Record<string, unknown>;
  const format = typeof schema.format === "string" ? schema.format.toLowerCase() : undefined;
  const types = Array.isArray(schema.type) ? schema.type : [schema.type];

  return types.includes("integer") && (format === "int64" || format === "i64");
}
