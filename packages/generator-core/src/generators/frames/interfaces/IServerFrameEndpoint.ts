import type { OpenAPIV3 } from "openapi-types";

export interface IServerFrameEndpoint {
  host?: string;
  hostCode?: string;
  pathPrefix?: string;
  serverVariables?: Record<string, OpenAPIV3.ServerVariableObject>;
}
