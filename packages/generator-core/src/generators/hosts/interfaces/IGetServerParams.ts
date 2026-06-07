import type { OpenAPIV3 } from "openapi-types";
import type { ILoadResult } from "#openapi/interfaces/ILoadResult.js";

export interface IGetServerParams {
  host?: string;
  specPath: { path: string; from: ILoadResult["from"] };
  document: OpenAPIV3.Document;
}
