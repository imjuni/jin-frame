import { isFileSchema } from '#/generators/octet-stream/isFileSchema';
import type { OpenAPIV3 } from 'openapi-types';

interface IFileKey {
  name: string;
  isArray: boolean;
}

export function getFileUploadKeyMap(
  _requestBody: OpenAPIV3.ReferenceObject | OpenAPIV3.RequestBodyObject | undefined,
): Map<string, IFileKey> {
  const requestBody = _requestBody as OpenAPIV3.RequestBodyObject | undefined;
  const multipartFormData = requestBody?.content?.['multipart/form-data'];
  const schema = multipartFormData?.schema as OpenAPIV3.SchemaObject | undefined;

  if (schema == null || schema.type !== 'object' || schema.properties == null) {
    return new Map();
  }

  const files: IFileKey[] = Object.entries(schema.properties)
    .map(([name, _prop]) => {
      const prop = _prop as OpenAPIV3.SchemaObject;
      const file = isFileSchema(prop);

      if (file.isFile) {
        return { name, isArray: file.isArray } satisfies IFileKey;
      }

      return undefined;
    })
    .filter((property) => property != null);

  return new Map(files.map((file) => [file.name, file]));
}
