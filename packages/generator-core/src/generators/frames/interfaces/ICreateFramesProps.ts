import type { OpenAPIV3 } from "openapi-types";

export interface ICreateFramesProps {
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
}
