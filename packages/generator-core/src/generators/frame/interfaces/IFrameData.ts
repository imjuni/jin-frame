import type {
  DecoratorStructure,
  OptionalKind,
  PropertyDeclarationStructure,
  TypeAliasDeclarationStructure,
} from "ts-morph";

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
  typeAliases: OptionalKind<TypeAliasDeclarationStructure>[];
  decorators: OptionalKind<DecoratorStructure>[];
  properties: OptionalKind<PropertyDeclarationStructure>[];
  parentFrame: string;
  responseTypes: string[];
}
