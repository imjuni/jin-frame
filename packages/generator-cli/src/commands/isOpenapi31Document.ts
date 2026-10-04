import type { OpenAPIV3_1 } from "openapi-types";

export function isOpenapi31Document(document: unknown): document is OpenAPIV3_1.Document {
  return (
    typeof document === "object" &&
    document != null &&
    "openapi" in document &&
    typeof document.openapi === "string" &&
    document.openapi.startsWith("3.1")
  );
}
