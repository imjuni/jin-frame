import { getParameter } from '#/generators/parameters/getParameter';
import type { OpenAPIV3 } from 'openapi-types';
import { describe, expect, it } from 'vitest';

describe('getParameter', () => {
  const parameter: OpenAPIV3.ParameterObject = {
    name: 'status',
    in: 'query',
    description: 'Status values that need to be considered for filter',
    required: true,
    explode: true,
    schema: {
      type: 'string',
      default: 'available',
      enum: ['available', 'pending', 'sold'],
    },
  };

  it('should return query parameter', () => {
    const result = getParameter({ method: 'method', pathKey: 'pa/th/key', parameter });
    expect(result).toEqual({
      decorator: 'Query',
      property: {
        decorators: [
          {
            name: 'Query',
            arguments: ['{ comma: true }'],
          },
        ],
        docs: ['Status values that need to be considered for filter'],
        name: 'status',
        type: "NonNullable<paths['pa/th/key']['method']['parameters']['query']>['status']",
        hasDeclareKeyword: true,
        isReadonly: true,
        hasQuestionToken: true,
        scope: 'public',
        kind: 31,
      },
    });
  });

  it('should return query parameter with explode false and required undefined', () => {
    const specificParameter = structuredClone(parameter);
    specificParameter.explode = false;
    specificParameter.required = undefined;

    const result = getParameter({
      method: 'method',
      pathKey: 'pa/th/key',
      parameter: specificParameter,
    });

    expect(result).toEqual({
      decorator: 'Query',
      property: {
        decorators: [
          {
            name: 'Query',
            arguments: [],
          },
        ],
        docs: ['Status values that need to be considered for filter'],
        name: 'status',
        type: "NonNullable<paths['pa/th/key']['method']['parameters']['query']>['status']",
        hasDeclareKeyword: true,
        isReadonly: true,
        hasQuestionToken: false,
        scope: 'public',
        kind: 31,
      },
    });
  });

  it('should return undefined when parameter in is unknown', () => {
    const specificParameter = structuredClone(parameter);
    specificParameter.in = 'unknown';

    const result = getParameter({
      method: 'method',
      pathKey: 'pa/th/key',
      parameter: specificParameter,
    });

    expect(result).toBeUndefined();
  });
});
