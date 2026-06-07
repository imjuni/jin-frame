import type { OpenAPIV3 } from "openapi-types";

export interface IGetBodyParameterProps {
  method: string;
  pathKey: string;
  contentType?: string;
  requestBody?: OpenAPIV3.ReferenceObject | OpenAPIV3.RequestBodyObject;
}
