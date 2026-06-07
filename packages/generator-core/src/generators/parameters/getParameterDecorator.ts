import type { OpenAPIV3 } from "openapi-types";

export function getParameterDecorator(
  _parameterIn: OpenAPIV3.ParameterObject["in"],
): { decorator: "Query" | "Param" | "Header" | "Cookie"; in: "query" | "path" | "header" | "cookie" } | undefined {
  const parameterIn = _parameterIn.toLocaleLowerCase();

  switch (parameterIn) {
    case "query":
      return { decorator: "Query", in: parameterIn };
    case "path":
      return { decorator: "Param", in: parameterIn };
    case "header":
      return { decorator: "Header", in: parameterIn };
    case "cookie":
      return { decorator: "Cookie", in: parameterIn };
    default:
      return undefined;
  }
}
