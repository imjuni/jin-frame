import { getParameterDecorator } from '#/generators/parameters/getParameterDecorator';
import { getParameterJsDoc } from '#/generators/parameters/getParameterJsDoc';
import type { OpenAPIV3 } from 'openapi-types';
import { StructureKind, Scope, type PropertyDeclarationStructure } from 'ts-morph';

interface IProps {
  method: string;
  pathKey: string;
  parameter: OpenAPIV3.ParameterObject;
}

interface IResult {
  decorator: 'Query' | 'Param' | 'Header';
  property: PropertyDeclarationStructure;
}

export function getParameter(params: IProps): IResult | undefined {
  const decorator = getParameterDecorator(params.parameter.in);

  if (decorator == null) {
    return undefined;
  }

  const docs = getParameterJsDoc(params.parameter);
  const decorators: PropertyDeclarationStructure['decorators'] = [
    {
      name: decorator.decorator,
      arguments: decorator.decorator === 'Query' && params.parameter.explode ? ['{ comma: true }'] : [],
    },
  ];

  const property: PropertyDeclarationStructure = {
    decorators,
    docs,
    name: params.parameter.name,
    type: `NonNullable<paths['${params.pathKey}']['${params.method}']['parameters']['${decorator?.in}']>['${params.parameter.name}']`,
    hasDeclareKeyword: true,
    isReadonly: true,
    hasQuestionToken: params.parameter.required ?? false,
    scope: Scope.Public,
    kind: StructureKind.Property,
  };

  return { decorator: decorator.decorator, property };
}
