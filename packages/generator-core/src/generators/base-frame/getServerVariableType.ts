import type { OpenAPIV3 } from "openapi-types";

export function getServerVariableType(variable: OpenAPIV3.ServerVariableObject): string {
  if (variable.enum == null || variable.enum.length === 0) {
    return "string";
  }

  return variable.enum.map((value) => `'${value}'`).join(" | ");
}
