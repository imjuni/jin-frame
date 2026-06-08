import type { Project } from "ts-morph";
import type { IFrameData } from "#generators/frame/interfaces/IFrameData.js";

export function renderFrameSource(project: Project, aliasFilePath: string, data: IFrameData): string {
  const sourceFile = project.createSourceFile(aliasFilePath);

  for (const importDeclaration of data.imports) {
    sourceFile.addImportDeclaration(importDeclaration);
  }

  sourceFile.addClass({
    name: data.name,
    docs: [{ description: data.docs }],
    decorators: data.decorators,
    properties: data.properties,
    isExported: true,
    extends: `${data.parentFrame}<paths${data.responseTypeMappedAccessPath}>`,
  });

  return sourceFile.print();
}
