import { type OptionalKind, type Project, type PropertyDeclarationStructure, Scope, StructureKind } from "ts-morph";
import type { IBaseFrameData } from "#generators/base-frame/interfaces/IBaseFrameData.js";
import type { IPropertyData } from "#generators/interfaces/IPropertyData.js";

function toPropertyDeclarationStructure(property: IPropertyData): OptionalKind<PropertyDeclarationStructure> {
  return {
    ...property,
    scope: Scope.Public,
    kind: StructureKind.Property,
  };
}

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
    properties: data.properties.map(toPropertyDeclarationStructure),
    methods: data.methods,
    isExported: true,
    extends: data.extends,
  });

  return sourceFile.print();
}
