import type { OpenAPIV3 } from "openapi-types";
import type { IFrameOverrides } from "#generators/frames/interfaces/IFrameOverrides.js";
import type { ISecurityProviderOptions } from "#generators/security/interfaces/ISecurityProviderOptions.js";

export interface ICreateFramesProps extends ISecurityProviderOptions {
  specTypeFilePath: string;
  specFilePath?: string;
  baseFrame?: string;
  host?: string;
  output: string;
  useCodeFence: boolean;
  timeout?: number;
  document: OpenAPIV3.Document;
  hostStrategy?: "string" | "function" | "env-function";
  hostEnvVar?: string;
  hostFunctionName?: string;
  serverMapping?: Record<string, string>;
  overrides?: IFrameOverrides;
}
