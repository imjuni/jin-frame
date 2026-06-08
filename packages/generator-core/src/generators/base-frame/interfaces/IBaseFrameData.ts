import type {
  DecoratorStructure,
  MethodDeclarationStructure,
  OptionalKind,
  PropertyDeclarationStructure,
  TypeParameterDeclarationStructure,
} from "ts-morph";
import type { IFrameDataImport } from "#generators/frame/interfaces/IFrameData.js";

export interface IBaseFrameData {
  name: string;
  filePath: string;
  docs: string;
  imports: IFrameDataImport[];
  typeParameters: OptionalKind<TypeParameterDeclarationStructure>[];
  decorators: OptionalKind<DecoratorStructure>[];
  properties: OptionalKind<PropertyDeclarationStructure>[];
  methods: OptionalKind<MethodDeclarationStructure>[];
  extends: string;
}
