import type { OpenAPIV3 } from "openapi-types";
import { getFirstResponseContentType } from "#generators/content-type/getFirstResponseContentType.js";
import type { IResponseContentTypes } from "#generators/content-type/interfaces/IResponseContentTypes.js";

export function getResponseContentTypes(responses?: OpenAPIV3.ResponsesObject): IResponseContentTypes {
  if (responses == null) {
    return {};
  }

  const statusCodes = Object.keys(responses);
  const successStatusCodes = statusCodes
    .filter((statusCode) => /^2(?:\d\d|XX)$/.test(statusCode))
    .sort((left, right) => (left === "2XX" ? 1 : right === "2XX" ? -1 : 0));
  const failStatusCodes = statusCodes.filter((statusCode) => !/^2(?:\d\d|XX)$/.test(statusCode));

  return {
    success: getFirstResponseContentType(responses, successStatusCodes),
    fail: getFirstResponseContentType(responses, failStatusCodes),
  };
}
