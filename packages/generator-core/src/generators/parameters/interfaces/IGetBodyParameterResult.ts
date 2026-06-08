import type { IPropertyData } from "#generators/interfaces/IPropertyData.js";

export interface IGetBodyParameterResult {
  decorator: "Body" | "ObjectBody";
  property: IPropertyData;
}
