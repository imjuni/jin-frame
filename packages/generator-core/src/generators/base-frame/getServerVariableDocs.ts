import type { OpenAPIV3 } from "openapi-types";

export function getServerVariableDocs(variable: OpenAPIV3.ServerVariableObject): string | undefined {
  const docs = [
    variable.description,
    variable.default != null ? `@default ${variable.default}` : undefined,
    variable.enum != null && variable.enum.length > 0 ? `@enum ${variable.enum.join(", ")}` : undefined,
  ].filter((doc) => doc != null && doc !== "");

  return docs.length > 0 ? docs.join("\n") : undefined;
}
