import type { OpenAPIV3 } from "openapi-types";
import { getFirstContentType } from "#/generators/content-type/getFirstContentType";
import { preferredContentTypes } from "#/generators/content-type/preferredContentTypes";

export function getRequestContentType(
  _requestBody?: OpenAPIV3.ReferenceObject | OpenAPIV3.RequestBodyObject,
): string | undefined {
  const requestBody = _requestBody as OpenAPIV3.RequestBodyObject | undefined;
  const content = requestBody?.content;

  if (content == null) {
    return undefined;
  }

  const firstContentType = getFirstContentType(preferredContentTypes, content);
  return firstContentType?.mediaType;
}
