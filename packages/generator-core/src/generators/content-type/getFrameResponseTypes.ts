import { getResponseContentTypes } from "#generators/content-type/getResponseContentTypes.js";
import { getResponseTypeMappedAccessPath } from "#generators/content-type/getResponseTypeMappedAccessPath.js";
import { hasFailResponse } from "#generators/content-type/hasFailResponse.js";
import type { IGetFrameResponseTypesProps } from "#generators/content-type/interfaces/IGetFrameResponseTypesProps.js";

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
