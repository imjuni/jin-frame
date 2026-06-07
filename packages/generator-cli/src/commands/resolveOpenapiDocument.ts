import { convertor, validate } from "@jin-frame/generator-core";
import type { OpenAPIV2 } from "openapi-types";

function isSwaggerV2Document(document: unknown): document is OpenAPIV2.Document {
  return (
    typeof document === "object" &&
    document != null &&
    "swagger" in document &&
    (document as { swagger?: unknown }).swagger === "2.0"
  );
}

export async function resolveOpenapiDocument(document: unknown, specPath: string) {
  const validated = validate(document);

  if (validated.valid) {
    return convertor(validated);
  }

  if (!isSwaggerV2Document(document)) {
    throw new Error(`Failed to validate spec from "${specPath}"`);
  }

  const converted = await convertor({
    valid: true,
    version: 2,
    document,
    errors: validated.errors,
  });
  const convertedValidated = validate(converted.document);

  if (!convertedValidated.valid) {
    throw new Error(`Failed to validate converted spec from "${specPath}"`);
  }

  return convertor(convertedValidated);
}
