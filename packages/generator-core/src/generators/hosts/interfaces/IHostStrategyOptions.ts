export interface IHostStrategyOptions {
  hostStrategy?: "string" | "function" | "env-function";
  hostEnvVar?: string;
  hostFunctionName?: string;
  serverMapping?: Record<string, string>;
  host?: string;
}
