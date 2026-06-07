import type { OpenAPIV3 } from "openapi-types";

export interface IGetServerUrlParams {
  specUrl: URL;
  server: OpenAPIV3.ServerObject;
}
