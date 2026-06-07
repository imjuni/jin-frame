import type { OpenAPIV3 } from "openapi-types";

export function mergeParameters(
  pathParameters?: OpenAPIV3.PathItemObject["parameters"],
  operationParameters?: OpenAPIV3.OperationObject["parameters"],
): OpenAPIV3.OperationObject["parameters"] | undefined {
  const parameters = [...(pathParameters ?? []), ...(operationParameters ?? [])];

  if (parameters.length === 0) {
    return undefined;
  }

  return Array.from(
    parameters
      .reduce((aggregate, parameter) => {
        if ("$ref" in parameter) {
          aggregate.set(parameter.$ref, parameter);
          return aggregate;
        }

        aggregate.set(`${parameter.in}:${parameter.name}`, parameter);
        return aggregate;
      }, new Map<string, OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject>())
      .values(),
  );
}
