import type { IFrameDataImport } from "#generators/frame/interfaces/IFrameDataImport.js";
import type { IPropertyData } from "#generators/interfaces/IPropertyData.js";

export interface IFrameData {
  name: string;
  filePath: string;
  tag?: string;
  docs: string;
  imports: IFrameDataImport[];
  typeAliases: { name: string; type: string; docs?: { description: string }[]; isExported?: boolean }[];
  decorators: { name: string; arguments?: string[] }[];
  properties: IPropertyData[];
  parentFrame: string;
  responseTypes: string[];
}
