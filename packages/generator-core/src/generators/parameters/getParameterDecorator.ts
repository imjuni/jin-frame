import type { OpenAPIV3 } from 'openapi-types';

export function getParameterDecorator(
  _parameterIn: OpenAPIV3.ParameterObject['in'],
): { decorator: 'Query' | 'Param' | 'Header'; in: 'query' | 'path' | 'header' } | undefined {
  const parameterIn = _parameterIn.toLocaleLowerCase();

  switch (parameterIn) {
    case 'query':
      return { decorator: 'Query', in: parameterIn };
    case 'path':
      return { decorator: 'Param', in: parameterIn };
    case 'header':
      return { decorator: 'Header', in: parameterIn };
    default:
      return undefined;
  }
}
