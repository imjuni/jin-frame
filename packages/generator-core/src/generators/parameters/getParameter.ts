import type { IPropertyData, IPropertyDecoratorData } from "#generators/interfaces/IPropertyData.js";
import { getParameterDecorator } from "#generators/parameters/getParameterDecorator.js";
import { getParameterJsDoc } from "#generators/parameters/getParameterJsDoc.js";
import type { IGetParameterProps } from "#generators/parameters/interfaces/IGetParameterProps.js";
import type { IGetParameterResult } from "#generators/parameters/interfaces/IGetParameterResult.js";

function getParameterDecoratorArguments(parameter: IGetParameterProps["parameter"]): string[] {
  const style = parameter.style;

  if (parameter.in === "query") {
    if (style === "deepObject") {
      throw new Error(
        `Unsupported OpenAPI parameter serialization: query parameter "${parameter.name}" uses deepObject`,
      );
    }

    if (style === "spaceDelimited") {
      return ['{ separator: " " }'];
    }

    if (style === "pipeDelimited") {
      return ['{ separator: "|" }'];
    }

    if (style == null || style === "form") {
      const explode = parameter.explode ?? true;
      return explode ? [] : ["{ comma: true }"];
    }
  }

  const supportedStyle =
    style == null ||
    (parameter.in === "path" && style === "simple") ||
    (parameter.in === "header" && style === "simple") ||
    (parameter.in === "cookie" && style === "form");

  if (!supportedStyle) {
    throw new Error(
      `Unsupported OpenAPI parameter serialization: ${parameter.in} parameter "${parameter.name}" uses ${style}`,
    );
  }

  return [];
}

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
      arguments: getParameterDecoratorArguments(params.parameter),
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
