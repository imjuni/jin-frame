import type { DecoratorStructure, OptionalKind, PropertyDeclarationStructure } from "ts-morph";

export interface IFrameDataImport {
  moduleSpecifier: string;
  namedImports: string[];
}

export interface IFrameData {
  name: string;
  filePath: string;
  tag?: string;
  docs: string;
  imports: IFrameDataImport[];
  decorators: OptionalKind<DecoratorStructure>[];
  properties: OptionalKind<PropertyDeclarationStructure>[];
  parentFrame: string;
  responseTypeMappedAccessPath: string;
}
