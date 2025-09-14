import { describe, expect, it } from 'vitest';
import { getBodyParameter } from '#/generators/parameters/getBodyParameter';
import type { OpenAPIV3 } from 'openapi-types';

describe('getBodyParameter', () => {
  const requestBody = {
    schema: {
      required: ['name', 'photoUrls'],
      type: 'object',
      description: 'Create a new pet in the store',
      properties: {
        id: {
          type: 'integer',
          format: 'int64',
          example: 10,
        },
        name: {
          type: 'string',
          example: 'doggie',
        },
        category: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              format: 'int64',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'Dogs',
            },
          },
        },
        photoUrls: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        tags: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                format: 'int64',
              },
              name: {
                type: 'string',
              },
            },
          },
        },
        status: {
          type: 'string',
          description: 'pet status in the store',
          enum: ['available', 'pending', 'sold'],
        },
      },
    },
  } satisfies Omit<OpenAPIV3.MediaTypeObject, 'schema'> & {
    schema: OpenAPIV3.SchemaObject;
  };

  it('should return empty array when request body is undefined', () => {
    const result = getBodyParameter({
      method: 'get',
      pathKey: 'pa/th/key',
      contentType: 'application/json',
      requestBody: undefined,
    });

    expect(result).toEqual([]);
  });

  it('should return ObjectBody parameter when request body is application/json', () => {
    const result = getBodyParameter({
      method: 'get',
      pathKey: 'pa/th/key',
      contentType: 'application/json',
      requestBody: { content: { 'application/json': requestBody } },
    });

    expect(result).toEqual([
      {
        decorator: 'ObjectBody',
        property: {
          decorators: [
            {
              arguments: [],
              name: 'ObjectBody',
            },
          ],
          docs: [],
          name: 'body',
          type: "NonNullable<paths['pa/th/key']['get']['requestBody']>['content']['application/json']",
          hasDeclareKeyword: true,
          isReadonly: true,
          hasQuestionToken: false,
          scope: 'public',
          kind: 31,
        },
      },
    ]);
  });

  it('should return Body parameter when request body is application/octet-stream', () => {
    const octetStreamRequestBody: OpenAPIV3.MediaTypeObject = {
      schema: {
        type: 'string',
        format: 'binary',
      },
    };

    const result = getBodyParameter({
      method: 'post',
      pathKey: 'pa/th/key',
      contentType: 'application/octet-stream',
      requestBody: { content: { 'application/octet-stream': octetStreamRequestBody } },
    });

    expect(result).toEqual([
      {
        decorator: 'Body',
        property: {
          decorators: [{ name: 'ObjectBody', arguments: [] }],
          docs: [],
          name: 'body',
          type: 'JinFile',
          hasDeclareKeyword: true,
          isReadonly: true,
          hasQuestionToken: false,
          scope: 'public',
          kind: 31,
        },
      },
    ]);
  });

  it('should return ObjectBody parameter when request body is multipart/form-data and have file upload', () => {
    const multipartFormDataRequestBody = structuredClone(requestBody);

    const result = getBodyParameter({
      method: 'get',
      pathKey: 'pa/th/key',
      contentType: 'multipart/form-data',
      requestBody: { content: { 'multipart/form-data': multipartFormDataRequestBody } },
    });

    expect(result).toEqual([
      {
        decorator: 'ObjectBody',
        property: {
          decorators: [
            {
              name: 'ObjectBody',
              arguments: [],
            },
          ],
          docs: [],
          name: 'body',
          type: "NonNullable<paths['pa/th/key']['get']['requestBody']>['content']['multipart/form-data']",
          hasDeclareKeyword: true,
          isReadonly: true,
          hasQuestionToken: false,
          scope: 'public',
          kind: 31,
        },
      },
    ]);
  });

  it('should return ObjectBody parameter when request body is multipart/form-data and have file upload', () => {
    const multipartFormDataRequestBody = structuredClone(requestBody);
    multipartFormDataRequestBody.schema.properties.photoUrls = {
      type: 'string',
      format: 'binary',
    } as any;

    const result = getBodyParameter({
      method: 'get',
      pathKey: 'pa/th/key',
      contentType: 'multipart/form-data',
      requestBody: { content: { 'multipart/form-data': multipartFormDataRequestBody } },
    });

    expect(result).toEqual([
      {
        decorator: 'ObjectBody',
        property: {
          decorators: [
            {
              name: 'ObjectBody',
              arguments: [],
            },
          ],
          docs: [],
          name: 'body',
          type: "Omit<NonNullable<paths['pa/th/key']['get']['requestBody']>['content']['multipart/form-data'], 'photoUrls'>",
          hasDeclareKeyword: true,
          isReadonly: true,
          hasQuestionToken: false,
          scope: 'public',
          kind: 31,
        },
      },
      {
        decorator: 'Body',
        property: {
          decorators: [
            {
              name: 'Body',
              arguments: [],
            },
          ],
          docs: [],
          name: 'photoUrls',
          type: 'JinFile',
          hasDeclareKeyword: true,
          isReadonly: true,
          hasQuestionToken: false,
          scope: 'public',
          kind: 31,
        },
      },
    ]);
  });

  it('should return ObjectBody parameter when request body is multipart/form-data and have multiple file upload', () => {
    const multipartFormDataRequestBody = structuredClone(requestBody);
    multipartFormDataRequestBody.schema.properties.photoUrls.type = 'array';
    multipartFormDataRequestBody.schema.properties.photoUrls.items = {
      type: 'string',
      format: 'binary',
    } as any;

    const result = getBodyParameter({
      method: 'get',
      pathKey: 'pa/th/key',
      contentType: 'multipart/form-data',
      requestBody: { content: { 'multipart/form-data': multipartFormDataRequestBody } },
    });

    expect(result).toEqual([
      {
        decorator: 'ObjectBody',
        property: {
          decorators: [
            {
              name: 'ObjectBody',
              arguments: [],
            },
          ],
          docs: [],
          name: 'body',
          type: "Omit<NonNullable<paths['pa/th/key']['get']['requestBody']>['content']['multipart/form-data'], 'photoUrls'>",
          hasDeclareKeyword: true,
          isReadonly: true,
          hasQuestionToken: false,
          scope: 'public',
          kind: 31,
        },
      },
      {
        decorator: 'Body',
        property: {
          decorators: [
            {
              name: 'Body',
              arguments: [],
            },
          ],
          docs: [],
          name: 'photoUrls',
          type: 'JinFile[]',
          hasDeclareKeyword: true,
          isReadonly: true,
          hasQuestionToken: false,
          scope: 'public',
          kind: 31,
        },
      },
    ]);
  });
});
