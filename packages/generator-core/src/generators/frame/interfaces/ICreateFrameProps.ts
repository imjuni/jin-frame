import type { OpenAPIV3 } from "openapi-types";
import type { IFrameOverrideRetry } from "#generators/frames/interfaces/IFrameOverrideRetry.js";
import type { ISecurityProviderReference } from "#generators/security/interfaces/ISecurityProviderReference.js";
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
  rootSecurity?: OpenAPIV3.SecurityRequirementObject[];
  securityProviders?: Map<string, ISecurityProviderReference>;
  method: THttpMethod;
  retry?: IFrameOverrideRetry;
  timeout?: number;
}
