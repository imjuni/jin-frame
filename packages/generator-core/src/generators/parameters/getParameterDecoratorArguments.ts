import type { IGetParameterProps } from "#generators/parameters/interfaces/IGetParameterProps.js";

export function getParameterDecoratorArguments(parameter: IGetParameterProps["parameter"]): string[] {
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
