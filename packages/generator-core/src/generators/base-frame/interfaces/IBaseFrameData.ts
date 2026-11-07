import type { IFrameDataImport } from "#generators/frame/interfaces/IFrameDataImport.js";
import type { IPropertyData } from "#generators/interfaces/IPropertyData.js";

export interface IBaseFrameData {
  name: string;
  filePath: string;
  docs: string;
  imports: IFrameDataImport[];
  typeParameters: { name: string; constraint?: string; default?: string }[];
  decorators: { name: string; arguments?: string[] }[];
  properties: IPropertyData[];
  methods: { name: string; returnType: string; statements: string[] }[];
  extends: string;
}
