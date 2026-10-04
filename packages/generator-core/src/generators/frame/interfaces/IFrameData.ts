import type { DecoratorStructure, OptionalKind, TypeAliasDeclarationStructure } from "ts-morph";
import type { IFrameDataImport } from "#generators/frame/interfaces/IFrameDataImport.js";
import type { IPropertyData } from "#generators/interfaces/IPropertyData.js";

export interface IFrameData {
  name: string;
  filePath: string;
  tag?: string;
  docs: string;
  imports: IFrameDataImport[];
  typeAliases: OptionalKind<TypeAliasDeclarationStructure>[];
  decorators: OptionalKind<DecoratorStructure>[];
  properties: IPropertyData[];
  parentFrame: string;
  responseTypes: string[];
}
