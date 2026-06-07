import type { OpenAPIV3 } from "openapi-types";

export interface IGetHostParams {
  host?: string;
  specTypeFilePath: string;
  document: OpenAPIV3.Document;
}
