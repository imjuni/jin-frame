import type { PropertyDeclarationStructure } from "ts-morph";

export interface IGetParameterResult {
  decorator: "Query" | "Param" | "Header" | "Cookie";
  property: PropertyDeclarationStructure;
}
