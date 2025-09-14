import { getFileUploadKeyMap } from '#/generators/octet-stream/getFileUploadKeyMap';
import type { OpenAPIV3 } from 'openapi-types';
import { describe, expect, it } from 'vitest';

describe('getFileUploadKeyMap', () => {
  const requestBody: OpenAPIV3.RequestBodyObject = {
    description: 'Create a new pet in the store',
    content: {
      'multipart/form-data': {
        schema: {
          required: ['name', 'photoUrls'],
          type: 'object',
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
            photoUrls: {
              type: 'array',
              items: {
                type: 'string',
                format: 'binary',
              },
            },
            status: {
              type: 'string',
              description: 'pet status in the store',
              enum: ['available', 'pending', 'sold'],
            },
          },
        },
      },
    },
    required: true,
  };

  it('should return file upload map when request body have file upload', () => {
    const result = getFileUploadKeyMap(requestBody);
    expect(result).toEqual(new Map([['photoUrls', { name: 'photoUrls', isArray: true }]]));
  });

  it('should return file upload map when request body have file upload', () => {
    const result = getFileUploadKeyMap({
      ...requestBody,
      content: {
        ...requestBody.content,
        'multipart/form-data': {
          schema: undefined,
        },
      },
    });
    expect(result).toEqual(new Map());
  });
});
