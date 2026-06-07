import type { OpenAPIV3 } from "openapi-types";

export interface ICreateBaseFrameProps {
  output: string;
  host?: string | (() => string);
  hostCode?: string;
  pathPrefix?: string | (() => string);
  pathPrefixCode?: string;
  name: string;
  timeout?: number;
  serverVariables?: Record<string, OpenAPIV3.ServerVariableObject>;
}
