import type { OpenAPIV3 } from "openapi-types";
import type { ICreateFramesProps } from "#generators/frames/interfaces/ICreateFramesProps.js";
import type { ISecurityProviderReference } from "#generators/security/interfaces/ISecurityProviderReference.js";

export interface IExtractFrameEndpointsParams {
  params: ICreateFramesProps;
  document: OpenAPIV3.Document;
  host: string | (() => string);
  hostCode?: string;
  securityProviders?: Map<string, ISecurityProviderReference>;
}
