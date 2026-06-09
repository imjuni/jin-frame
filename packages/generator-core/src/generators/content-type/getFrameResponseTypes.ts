import type { OpenAPIV3 } from "openapi-types";
import { getResponseContentTypes } from "#generators/content-type/getResponseContentTypes.js";
import { getResponseTypeMappedAccessPath } from "#generators/content-type/getResponseTypeMappedAccessPath.js";

export interface IGetFrameResponseTypesProps {
  pathKey: string;
  method: string;
  responses?: OpenAPIV3.ResponsesObject;
}

function hasFailResponse(responses?: OpenAPIV3.ResponsesObject): boolean {
  if (responses == null) {
    return false;
  }

  return Object.keys(responses).some((statusCode) => !/^2\d\d$/.test(statusCode));
}

export function getFrameResponseTypes(params: IGetFrameResponseTypesProps): string[] {
  const responseContentTypes = getResponseContentTypes(params.responses);
  const successType =
    responseContentTypes.success != null
      ? `paths${getResponseTypeMappedAccessPath({
          method: params.method,
          pathKey: params.pathKey,
          responseContentType: responseContentTypes.success,
        })}`
      : "void";

  const failType =
    responseContentTypes.fail != null
      ? `paths${getResponseTypeMappedAccessPath({
          method: params.method,
          pathKey: params.pathKey,
          responseContentType: responseContentTypes.fail,
        })}`
      : hasFailResponse(params.responses)
        ? "void"
        : undefined;

  return [successType, failType].filter((type) => type != null);
}
