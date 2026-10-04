import { type OptionalKind, type PropertyDeclarationStructure, Scope, StructureKind } from "ts-morph";
import type { IPropertyData } from "#generators/interfaces/IPropertyData.js";

export function toPropertyDeclarationStructure(property: IPropertyData): OptionalKind<PropertyDeclarationStructure> {
  return {
    ...property,
    scope: Scope.Public,
    kind: StructureKind.Property,
  };
}
