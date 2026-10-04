import type { Project } from "ts-morph";
import { formatFrameSource } from "#generators/frame/formatFrameSource.js";
import type { IFrameData } from "#generators/frame/interfaces/IFrameData.js";
import { toPropertyDeclarationStructure } from "#generators/frame/toPropertyDeclarationStructure.js";

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
    properties: data.properties.map(toPropertyDeclarationStructure),
    isExported: true,
    extends: `${data.parentFrame}<${data.responseTypes.join(", ")}>`,
  });

  return formatFrameSource(sourceFile.print());
}
