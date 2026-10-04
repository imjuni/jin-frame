export function isNullableSchema(schemaObject: unknown): boolean {
  if (schemaObject == null || typeof schemaObject !== "object" || Array.isArray(schemaObject)) {
    return false;
  }

  const schema = schemaObject as Record<string, unknown>;
  return schema.nullable === true || (Array.isArray(schema.type) && schema.type.includes("null"));
}
