import type { OpenAPIV3 } from 'openapi-types';

export function getFirstContentType(
  preferreds: string[],
  content?: Record<string, OpenAPIV3.MediaTypeObject>,
): { mediaType: string; value?: OpenAPIV3.MediaTypeObject } | undefined {
  if (content == null) {
    return undefined;
  }

  for (const preferred of preferreds) {
    for (const mediaType of Object.keys(content)) {
      if (mediaType === preferred) {
        return {
          mediaType,
          value: content[mediaType],
        };
      }

      // wildcard matching
      if (preferred.endsWith('/*') && mediaType.startsWith(preferred.slice(0, -1))) {
        return {
          mediaType,
          value: content[mediaType],
        };
      }

      if (preferred.includes('*+')) {
        const [pre, post] = preferred.split('*+');

        if (
          pre != null &&
          post != null &&
          mediaType.startsWith(pre) &&
          mediaType.endsWith(`+${post}`)
        ) {
          return { mediaType, value: content[mediaType] };
        }
      }
    }
  }

  const first = Object.keys(content).at(0);

  if (first != null) {
    return {
      mediaType: first,
      value: content[first],
    };
  }

  return undefined;
}
