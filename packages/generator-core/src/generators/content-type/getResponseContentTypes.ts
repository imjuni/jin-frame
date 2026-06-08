import type { OpenAPIV3 } from "openapi-types";
import { getFirstContentType } from "#generators/content-type/getFirstContentType.js";
import { preferredContentTypes } from "#generators/content-type/preferredContentTypes.js";

export interface IResponseContentType {
  statusCode: string;
  mediaType: string;
}

export interface IResponseContentTypes {
  success?: IResponseContentType;
  fail?: IResponseContentType;
}

function getFirstResponseContentType(
  responses: OpenAPIV3.ResponsesObject,
  statusCodes: string[],
): IResponseContentType | undefined {
  for (const statusCode of statusCodes) {
    const first = getFirstContentType(
      preferredContentTypes,
      (responses[statusCode] as OpenAPIV3.ResponseObject | undefined)?.content,
    );

    if (first != null) {
      return {
        statusCode,
        mediaType: first.mediaType,
      };
    }
  }

  return undefined;
}

export function getResponseContentTypes(responses?: OpenAPIV3.ResponsesObject): IResponseContentTypes {
  if (responses == null) {
    return {};
  }

  const statusCodes = Object.keys(responses);
  const successStatusCodes = statusCodes.filter((statusCode) => /^2\d\d$/.test(statusCode));
  const failStatusCodes = statusCodes.filter((statusCode) => !/^2\d\d$/.test(statusCode));

  return {
    success: getFirstResponseContentType(responses, successStatusCodes),
    fail: getFirstResponseContentType(responses, failStatusCodes),
  };
}
