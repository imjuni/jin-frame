import { type MethodDeclarationStructure, Scope, StructureKind } from "ts-morph";

export function getServerVariableDefaultMethods(
  name: string,
  serverVariableDefaults: Record<string, string>,
): MethodDeclarationStructure[] {
  if (Object.keys(serverVariableDefaults).length === 0) {
    return [];
  }

  return [
    {
      kind: StructureKind.Method,
      name: "getDefaultValues",
      isStatic: true,
      hasOverrideKeyword: true,
      scope: Scope.Protected,
      returnType: `Partial<${name}>`,
      statements: [`return ${JSON.stringify(serverVariableDefaults)};`],
    },
  ];
}
