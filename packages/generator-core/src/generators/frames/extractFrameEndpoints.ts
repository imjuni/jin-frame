import type { OpenAPIV3 } from "openapi-types";
import type { ICreateFramesProps } from "#generators/frames/interfaces/ICreateFramesProps.js";
import type { IFrameEndpoint } from "#generators/frames/interfaces/IFrameEndpoint.js";
import { mergeParameters } from "#generators/frames/mergeParameters.js";
import type { ISecurityProviderReference } from "#generators/security/interfaces/ISecurityProviderReference.js";
import type { THttpMethod } from "#https/method.js";

export interface IExtractFrameEndpointsParams {
  params: ICreateFramesProps;
  document: OpenAPIV3.Document;
  host: string | (() => string);
  hostCode?: string;
  securityProviders?: Map<string, ISecurityProviderReference>;
}

export function extractFrameEndpoints({
  params,
  document,
  host,
  hostCode,
  securityProviders,
}: IExtractFrameEndpointsParams): IFrameEndpoint[] {
  const paths = document.paths ?? {};
  const methods: THttpMethod[] = ["get", "post", "put", "delete", "patch", "head", "options"];

  return Object.keys(paths).flatMap((pathKey) => {
    const apiPath = paths[pathKey];
    const pathParameters = apiPath?.parameters;

    return methods
      .map((method): IFrameEndpoint | undefined => {
        const operation = apiPath?.[method];

        if (operation == null) {
          return undefined;
        }

        return {
          specTypeFilePath: params.specTypeFilePath,
          output: params.output,
          host,
          hostCode,
          hostOverride: params.overrides?.hosts?.[pathKey],
          baseFrame: params.baseFrame,
          pathKey,
          method,
          operation: {
            ...operation,
            parameters: mergeParameters(pathParameters, operation.parameters),
          },
          rootSecurity: document.security,
          securityProviders,
          retry: params.overrides?.retries?.[pathKey],
          timeout: params.overrides?.timeouts?.[pathKey],
        };
      })
      .filter((endpoint) => endpoint != null);
  });
}
