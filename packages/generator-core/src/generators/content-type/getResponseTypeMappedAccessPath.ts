import type { IGetResponseTypeMappedAccessPathProps } from "#generators/content-type/interfaces/IGetResponseTypeMappedAccessPathProps.js";

export function getResponseTypeMappedAccessPath(params: IGetResponseTypeMappedAccessPathProps): string {
  const contentPath = params.responseContentType.mediaType !== "" ? "content" : undefined;
  const mediaTypePath = params.responseContentType.mediaType !== "" ? params.responseContentType.mediaType : undefined;

  const responseTypeMappedAccessPath = [
    params.pathKey,
    params.method,
    "responses",
    params.responseContentType.statusCode,
    contentPath,
    mediaTypePath,
  ]
    .filter((element) => element != null)
    .map((element) => `['${element}']`)
    .join("");

  return responseTypeMappedAccessPath;
}
