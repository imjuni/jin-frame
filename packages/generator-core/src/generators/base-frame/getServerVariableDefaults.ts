import type { OpenAPIV3 } from "openapi-types";

export function getServerVariableDefaults(
  serverVariables: [string, OpenAPIV3.ServerVariableObject][],
): Record<string, string> {
  return Object.fromEntries(
    serverVariables
      .filter(
        (entry): entry is [string, OpenAPIV3.ServerVariableObject & { default: string }] => entry[1].default != null,
      )
      .map(([variableName, variable]) => [variableName, variable.default]),
  );
}
