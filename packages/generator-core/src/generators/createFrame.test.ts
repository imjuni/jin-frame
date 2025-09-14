import { createFrame } from '#/generators/createFrame';
import type { OpenAPIV3 } from 'openapi-types';
import { Project } from 'ts-morph';
import { randomUUID } from 'node:crypto';
import { beforeEach, describe, expect, it, vitest } from 'vitest';

vitest.mock('node:crypto', () => ({
  randomUUID: vitest.fn(),
}));

describe('createFrame', () => {
  const project = new Project();
  const operationRequestBody = {
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
  };
  const parameters = [
    {
      name: 'status',
      in: 'query',
      description: 'Status values that need to be considered for filter',
      required: true,
      explode: true,
      example: 'ironman',
      schema: {
        type: 'string',
        default: 'available',
        enum: ['available', 'pending', 'sold'],
      },
    },
    {
      name: 'name',
      in: 'query',
      description: 'Name of pet that needs to be updated',
      schema: {
        type: 'string',
      },
    },
  ];

  beforeEach(() => {
    vitest.clearAllMocks();
  });

  it('should return full frame when pass param with requestBody', () => {
    const mockUuid = 'mockuuid-fe32-4d5d-923e-68fc16766231';
    vitest.mocked(randomUUID).mockReturnValue(mockUuid);

    const frame = createFrame(project, {
      specTypeFilePath: '/a/b/petstore.d.ts',
      host: 'https://pokeapi.co',
      output: '/a/b',
      pathKey: '/pet/findByStatus/{status}',
      method: 'GET',
      operation: {
        description: 'Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.',
        summary: 'Finds Pets by tags.',
        requestBody: {
          description: 'Update an existent pet in the store',
          content: {
            'application/json': { schema: operationRequestBody },
            'application/xml': { schema: operationRequestBody },
            'application/x-www-form-urlencoded': { schema: operationRequestBody },
          },
          required: true,
        },
        parameters,
        tags: ['pet', 'cat'],
        responses: {
          '200': {
            description: 'successful operation',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Order',
                },
              },
            },
          },
          '400': {
            description: 'Invalid input',
          },
        },
      } as OpenAPIV3.OperationObject,
    });

    const source = `import { Get, Query, ObjectBody, JinFrame } from "jin-frame";
import { paths } from "../petstore";
/**
 * Finds Pets by tags.
 * Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
 *
 * @see GET /pet/findByStatus/{status}
 * @tag pet, cat
 */
@Get({ host: 'https://pokeapi.co', path: '/pet/findByStatus/:status' })
export class GetPetFindByStatusStatusFrame extends JinFrame<paths['/pet/findByStatus/{status}']['get']['responses']['200']['content']['application/json']> {
    /**
     * Status values that need to be considered for filter
     *
     * @example ironman
     */
    @Query({ comma: true })
    declare public readonly status?: NonNullable<paths['/pet/findByStatus/{status}']['get']['parameters']['query']>['status'];
    /** Name of pet that needs to be updated */
    @Query()
    declare public readonly name: NonNullable<paths['/pet/findByStatus/{status}']['get']['parameters']['query']>['name'];
    /** Update an existent pet in the store */
    @ObjectBody()
    declare public readonly body?: NonNullable<paths['/pet/findByStatus/{status}']['get']['requestBody']>['content']['application/json'];
}
`;

    expect(frame).toEqual({
      aliasFilePath: `${mockUuid}-${mockUuid}.ts`,
      filePath: 'GetPetFindByStatusStatusFrame.ts',
      tag: 'pet',
      source,
    });
  });

  it('should return full frame when pass param with requestBody', () => {
    const mockUuid = 'mockuuid-fe32-4d5d-923e-1234567890123';
    vitest.mocked(randomUUID).mockReturnValue(mockUuid);

    const testOperationRequestBody = structuredClone(operationRequestBody);
    testOperationRequestBody.properties.photoUrls = {
      ...testOperationRequestBody.properties.photoUrls,
      type: 'array',
      items: {
        type: 'string',
        format: 'binary',
      },
    } as any;

    const frame = createFrame(project, {
      specTypeFilePath: '/a/b/petstore.d.ts',
      host: 'https://pokeapi.co',
      output: '/a/b',
      pathKey: '/pet/findByStatus/{status}',
      method: 'GET',
      operation: {
        description: 'Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.',
        summary: 'Finds Pets by tags.',
        requestBody: {
          description: 'Update an existent pet in the store',
          content: {
            'multipart/form-data': { schema: testOperationRequestBody },
          },
          required: true,
        },
        parameters,
        tags: ['pet', 'cat'],
        responses: {
          '200': {
            description: 'successful operation',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Order',
                },
              },
            },
          },
          '400': {
            description: 'Invalid input',
          },
        },
      } as OpenAPIV3.OperationObject,
    });

    const source = `import { Get, Query, ObjectBody, Body, JinFrame } from "jin-frame";
import { paths } from "../petstore";
/**
 * Finds Pets by tags.
 * Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
 *
 * @see GET /pet/findByStatus/{status}
 * @tag pet, cat
 */
@Get({ host: 'https://pokeapi.co', path: '/pet/findByStatus/:status', contentType: 'multipart/form-data' })
export class GetPetFindByStatusStatusFrame extends JinFrame<paths['/pet/findByStatus/{status}']['get']['responses']['200']['content']['application/json']> {
    /**
     * Status values that need to be considered for filter
     *
     * @example ironman
     */
    @Query({ comma: true })
    declare public readonly status?: NonNullable<paths['/pet/findByStatus/{status}']['get']['parameters']['query']>['status'];
    /** Name of pet that needs to be updated */
    @Query()
    declare public readonly name: NonNullable<paths['/pet/findByStatus/{status}']['get']['parameters']['query']>['name'];
    /** Update an existent pet in the store */
    @ObjectBody()
    declare public readonly body?: Omit<NonNullable<paths['/pet/findByStatus/{status}']['get']['requestBody']>['content']['multipart/form-data'], 'photoUrls'>;
    /** Update an existent pet in the store */
    @Body()
    declare public readonly photoUrls?: JinFile[];
}
`;

    expect(frame).toEqual({
      aliasFilePath: `${mockUuid}-${mockUuid}.ts`,
      filePath: 'GetPetFindByStatusStatusFrame.ts',
      tag: 'pet',
      source,
    });
  });
});
