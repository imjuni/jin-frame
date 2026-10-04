import type { OpenAPIV2 } from "openapi-types";

export function isSwaggerV2Document(document: unknown): document is OpenAPIV2.Document {
  return (
    typeof document === "object" &&
    document != null &&
    "swagger" in document &&
    (document as { swagger?: unknown }).swagger === "2.0"
  );
}
