import type { IPropertyData, IPropertyDecoratorData } from "#generators/interfaces/IPropertyData.js";
import { getParameterDecorator } from "#generators/parameters/getParameterDecorator.js";
import { getParameterJsDoc } from "#generators/parameters/getParameterJsDoc.js";
import type { IGetParameterProps } from "#generators/parameters/interfaces/IGetParameterProps.js";
import type { IGetParameterResult } from "#generators/parameters/interfaces/IGetParameterResult.js";

export function getParameter(params: IGetParameterProps): IGetParameterResult | undefined {
  const decorator = getParameterDecorator(params.parameter.in);

  if (decorator == null) {
    return undefined;
  }

  const schemaDescription =
    params.parameter.schema != null && "description" in params.parameter.schema
      ? params.parameter.schema.description
      : undefined;
  const description = [params.parameter.description, schemaDescription]
    .filter((desc) => desc != null && desc !== "")
    .join("\n");
  const docs = getParameterJsDoc({
    ...params.parameter,
    description: description === "" ? undefined : description,
  });
  const decorators: IPropertyDecoratorData[] = [
    {
      name: decorator.decorator,
      arguments: decorator.decorator === "Query" && params.parameter.explode === false ? ["{ comma: true }"] : [],
    },
  ];

  const property: IPropertyData = {
    decorators,
    docs,
    name: params.parameter.name,
    type: `NonNullable<paths['${params.pathKey}']['${params.method}']['parameters']['${decorator?.in}']>['${params.parameter.name}']`,
    hasDeclareKeyword: true,
    isReadonly: true,
    hasQuestionToken: !(params.parameter.required ?? false),
  };

  return { decorator: decorator.decorator, property };
}
