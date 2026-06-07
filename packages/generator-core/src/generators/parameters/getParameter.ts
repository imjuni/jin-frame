import { type PropertyDeclarationStructure, Scope, StructureKind } from "ts-morph";
import { getParameterDecorator } from "#/generators/parameters/getParameterDecorator.js";
import { getParameterJsDoc } from "#/generators/parameters/getParameterJsDoc.js";
import type { IGetParameterProps } from "#/generators/parameters/interfaces/IGetParameterProps.js";
import type { IGetParameterResult } from "#/generators/parameters/interfaces/IGetParameterResult.js";

export function getParameter(params: IGetParameterProps): IGetParameterResult | undefined {
  const decorator = getParameterDecorator(params.parameter.in);

  if (decorator == null) {
    return undefined;
  }

  const docs = getParameterJsDoc(params.parameter);
  const decorators: PropertyDeclarationStructure["decorators"] = [
    {
      name: decorator.decorator,
      arguments: decorator.decorator === "Query" && params.parameter.explode ? ["{ comma: true }"] : [],
    },
  ];

  const property: PropertyDeclarationStructure = {
    decorators,
    docs,
    name: params.parameter.name,
    type: `NonNullable<paths['${params.pathKey}']['${params.method}']['parameters']['${decorator?.in}']>['${params.parameter.name}']`,
    hasDeclareKeyword: true,
    isReadonly: true,
    hasQuestionToken: !(params.parameter.required ?? false),
    scope: Scope.Public,
    kind: StructureKind.Property,
  };

  return { decorator: decorator.decorator, property };
}
