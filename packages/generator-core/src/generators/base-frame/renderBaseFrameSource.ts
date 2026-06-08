import type { Project } from "ts-morph";
import type { IBaseFrameData } from "#generators/base-frame/interfaces/IBaseFrameData.js";

export function renderBaseFrameSource(project: Project, aliasFilePath: string, data: IBaseFrameData): string {
  const sourceFile = project.createSourceFile(aliasFilePath);

  for (const importDeclaration of data.imports) {
    sourceFile.addImportDeclaration(importDeclaration);
  }

  sourceFile.addClass({
    name: data.name,
    docs: [{ description: data.docs }],
    typeParameters: data.typeParameters,
    decorators: data.decorators,
    properties: data.properties,
    methods: data.methods,
    isExported: true,
    extends: data.extends,
  });

  return sourceFile.print();
}
