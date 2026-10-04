import type { OpenAPIV3 } from "openapi-types";

export function hasFailResponse(responses?: OpenAPIV3.ResponsesObject): boolean {
  if (responses == null) {
    return false;
  }

  return Object.keys(responses).some((statusCode) => !/^2(?:\d\d|XX)$/.test(statusCode));
}
