import type {
  DecoratorStructure,
  MethodDeclarationStructure,
  OptionalKind,
  TypeParameterDeclarationStructure,
} from "ts-morph";
import type { IFrameDataImport } from "#generators/frame/interfaces/IFrameDataImport.js";
import type { IPropertyData } from "#generators/interfaces/IPropertyData.js";

export interface IBaseFrameData {
  name: string;
  filePath: string;
  docs: string;
  imports: IFrameDataImport[];
  typeParameters: OptionalKind<TypeParameterDeclarationStructure>[];
  decorators: OptionalKind<DecoratorStructure>[];
  properties: IPropertyData[];
  methods: OptionalKind<MethodDeclarationStructure>[];
  extends: string;
}
