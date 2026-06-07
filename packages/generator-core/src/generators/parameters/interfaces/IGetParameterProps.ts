import type { OpenAPIV3 } from "openapi-types";

export interface IGetParameterProps {
  method: string;
  pathKey: string;
  parameter: OpenAPIV3.ParameterObject;
}
