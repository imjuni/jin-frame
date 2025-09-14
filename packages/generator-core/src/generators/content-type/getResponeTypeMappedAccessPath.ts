interface IProps {
  pathKey: string;
  method: string;
  responseContentType?: { statusCode: string; mediaType: string };
}

export function getResponeTypeMappedAccessPath(params: IProps): string {
  const contentPath =
    params.responseContentType?.mediaType != null && params.responseContentType?.mediaType !== ''
      ? 'content'
      : undefined;
  const mediaTypePath =
    params.responseContentType?.mediaType != null && params.responseContentType?.mediaType !== ''
      ? params.responseContentType?.mediaType
      : undefined;

  const responeTypeMappedAccessPath = [
    params.pathKey,
    params.method,
    'responses',
    params.responseContentType?.statusCode,
    contentPath,
    mediaTypePath,
  ]
    .filter((element) => element != null)
    .map((element) => `['${element}']`)
    .join('');

  return responeTypeMappedAccessPath;
}
