import type { Project } from "ts-morph";
import type { IFrameData } from "#generators/frame/interfaces/IFrameData.js";

function formatFrameSource(source: string): string {
  return source
    .replaceAll(/\/\*\* (Response DTO|Request DTO) \*\//g, "/**\n * $1\n */")
    .replace(/(import[^\n]+;\n)(\/\*\*)/, "$1\n$2")
    .replaceAll(/(type [^;]+;)\n(\/\*\*)/g, "$1\n\n$2");
}

export function renderFrameSource(project: Project, aliasFilePath: string, data: IFrameData): string {
  const sourceFile = project.createSourceFile(aliasFilePath);

  for (const importDeclaration of data.imports) {
    sourceFile.addImportDeclaration(importDeclaration);
  }

  for (const typeAlias of data.typeAliases) {
    sourceFile.addTypeAlias(typeAlias);
  }

  sourceFile.addClass({
    name: data.name,
    docs: [{ description: data.docs }],
    decorators: data.decorators,
    properties: data.properties,
    isExported: true,
    extends: `${data.parentFrame}<${data.responseTypes.join(", ")}>`,
  });

  return formatFrameSource(sourceFile.print());
}
