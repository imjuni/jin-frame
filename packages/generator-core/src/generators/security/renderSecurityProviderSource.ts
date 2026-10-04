import { type Project, Scope, StructureKind } from "ts-morph";
import { formatSecurityProviderSource } from "#generators/security/formatSecurityProviderSource.js";
import type { ISecurityProviderData } from "#generators/security/interfaces/ISecurityProviderData.js";

export function renderSecurityProviderSource(
  project: Project,
  aliasFilePath: string,
  data: ISecurityProviderData,
): string {
  const sourceFile = project.createSourceFile(aliasFilePath);

  sourceFile.addImportDeclaration({
    moduleSpecifier: "jin-frame",
    namedImports: [data.builtinClassName],
  });

  sourceFile.addClass({
    name: data.className,
    isExported: true,
    extends: data.builtinClassName,
    ctors: [
      {
        scope: Scope.Public,
        statements: [`super(${data.constructorArguments.join(", ")});`],
      },
    ],
    kind: StructureKind.Class,
  });

  return formatSecurityProviderSource(sourceFile.print());
}
