import type { IPropertyData } from "#generators/interfaces/IPropertyData.js";

export interface IGetParameterResult {
  decorator: "Query" | "Param" | "Header" | "Cookie";
  property: IPropertyData;
}
