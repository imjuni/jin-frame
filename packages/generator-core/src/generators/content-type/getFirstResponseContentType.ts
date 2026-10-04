import type { OpenAPIV3 } from "openapi-types";
import { getFirstContentType } from "#generators/content-type/getFirstContentType.js";
import type { IResponseContentType } from "#generators/content-type/interfaces/IResponseContentType.js";
import { preferredContentTypes } from "#generators/content-type/preferredContentTypes.js";

export function getFirstResponseContentType(
  responses: OpenAPIV3.ResponsesObject,
  statusCodes: string[],
): IResponseContentType | undefined {
  for (const statusCode of statusCodes) {
    const first = getFirstContentType(
      preferredContentTypes,
      (responses[statusCode] as OpenAPIV3.ResponseObject | undefined)?.content,
    );
    if (first != null) return { statusCode, mediaType: first.mediaType };
  }
  return undefined;
}
