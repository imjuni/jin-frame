import type { OpenAPIV3 } from 'openapi-types';

interface IResult {
  isArray: boolean;
  isFile: boolean;
}

export function isFileSchema(
  _schema?: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject,
): IResult {
  const schema = _schema as OpenAPIV3.SchemaObject | undefined;

  if (schema == null) {
    return { isArray: false, isFile: false };
  }

  // 단일 파일
  if (schema.type === 'string' && (schema.format === 'binary' || schema.format === 'byte')) {
    return { isArray: false, isFile: true };
  }

  // 파일 배열
  if (schema.type === 'array' && schema.items) {
    const item = schema.items as OpenAPIV3.SchemaObject;

    if (item.type === 'string' && (item.format === 'binary' || item.format === 'byte')) {
      return { isArray: true, isFile: true };
    }

    return { isArray: true, isFile: false };
  }

  return { isArray: false, isFile: false };
}
