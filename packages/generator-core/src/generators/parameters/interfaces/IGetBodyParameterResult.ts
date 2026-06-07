import type { PropertyDeclarationStructure } from "ts-morph";

export interface IGetBodyParameterResult {
  decorator: "Body" | "ObjectBody";
  property: PropertyDeclarationStructure;
}
