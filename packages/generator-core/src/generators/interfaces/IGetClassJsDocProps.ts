import type { OpenAPIV3 } from "openapi-types";
import type { THttpMethod } from "#/https/method";

export interface IGetClassJsDocProps {
  pathKey: string;
  method: THttpMethod;
  operation?: Pick<OpenAPIV3.OperationObject, "description" | "summary" | "tags">;
}
