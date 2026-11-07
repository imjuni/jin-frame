import type { IGeneratorObserverOptions } from "#generators/interfaces/IGeneratorObserverOptions.js";
import type { OpenAPIV3, OpenAPIV3_1 } from "openapi-types";
import type { IFrameOverrides } from "#generators/frames/interfaces/IFrameOverrides.js";
import type { ISecurityProviderOptions } from "#generators/security/interfaces/ISecurityProviderOptions.js";

export interface ICreateFramesProps extends ISecurityProviderOptions, IGeneratorObserverOptions {
  templatePath?: string;
  specTypeFilePath: string;
  specFilePath?: string;
  baseFrame?: string;
  host?: string;
  output: string;
  useCodeFence: boolean;
  timeout?: number;
  document: OpenAPIV3.Document | OpenAPIV3_1.Document;
  hostStrategy?: "string" | "function" | "env-function";
  hostEnvVar?: string;
  hostFunctionName?: string;
  hostFunctionImport?: string;
  serverMapping?: Record<string, string>;
  overrides?: IFrameOverrides;
}
