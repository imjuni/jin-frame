import { type Project, Scope, StructureKind } from "ts-morph";
import type { ISecurityProviderData } from "#generators/security/interfaces/ISecurityProviderData.js";

function formatSecurityProviderSource(source: string): string {
  return source.replace(/(import[^\n]+;\n)(export class)/, "$1\n$2");
}

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
