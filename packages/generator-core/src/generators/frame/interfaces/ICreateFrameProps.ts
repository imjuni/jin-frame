import type { OpenAPIV3 } from "openapi-types";
import type { IFrameOverrideRetry } from "#generators/frames/interfaces/IFrameOverrideRetry.js";
import type { THttpMethod } from "#https/method.js";

export interface ICreateFrameProps {
  specTypeFilePath: string;
  baseFrame?: string;
  output: string;
  host: string | (() => string);
  hostCode?: string;
  hostOverride?: string;
  pathKey: string;
  operation: OpenAPIV3.OperationObject;
  method: THttpMethod;
  retry?: IFrameOverrideRetry;
  timeout?: number;
}
