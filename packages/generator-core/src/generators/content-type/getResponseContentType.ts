import { getFirstContentType } from '#/generators/content-type/getFirstContentType';
import { preferredContentTypes } from '#/generators/content-type/preferredContentTypes';
import type { OpenAPIV3 } from 'openapi-types';

export function getResponseContentType(
  responses?: OpenAPIV3.ResponsesObject,
): { statusCode: string; mediaType: string } | undefined {
  if (responses == null) {
    return undefined;
  }

  const statusCodes = Object.keys(responses);
  const statusCodesWithout200 = statusCodes.filter((statusCode) => statusCode !== '200');

  const successContentCode = getFirstContentType(
    preferredContentTypes,
    (responses['200'] as OpenAPIV3.ResponseObject | undefined)?.content,
  );

  if (successContentCode != null) {
    return { statusCode: '200', mediaType: successContentCode.mediaType };
  }

  const otherContentTypes = statusCodesWithout200
    .map((statusCode) => {
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

      return undefined;
    })
    .filter((contentType) => contentType != null);

  if (otherContentTypes.length <= 0 && statusCodes.includes('200')) {
    return { statusCode: '200', mediaType: '' };
  }

  const firstContentType = otherContentTypes.at(0);
  return firstContentType;
}
