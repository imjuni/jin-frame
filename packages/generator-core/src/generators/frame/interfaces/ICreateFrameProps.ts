import type { OpenAPIV3 } from "openapi-types";
import type { THttpMethod } from "#/https/method.js";

export interface ICreateFrameProps {
  specTypeFilePath: string;
  baseFrame?: string;
  output: string;
  host: string | (() => string);
  hostCode?: string;
  pathKey: string;
  operation: OpenAPIV3.OperationObject;
  method: THttpMethod;
}
