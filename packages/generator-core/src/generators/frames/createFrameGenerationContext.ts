import type { OpenAPIV3 } from "openapi-types";
import { getInlineHost } from "#generators/frames/getInlineHost.js";
import { getServerFrameEndpoint } from "#generators/frames/getServerFrameEndpoint.js";
import type { ICreateFramesProps } from "#generators/frames/interfaces/ICreateFramesProps.js";
import type { IFrameGenerationContext } from "#generators/frames/interfaces/IFrameGenerationContext.js";
import { generateHostValue } from "#generators/hosts/generateHostValue.js";

export function createFrameGenerationContext(
  params: ICreateFramesProps,
  document: OpenAPIV3.Document,
): IFrameGenerationContext {
  const serverFrameEndpoint = getServerFrameEndpoint(params, document);
  const host =
    params.baseFrame != null
      ? (serverFrameEndpoint.host ?? serverFrameEndpoint.hostCode ?? "")
      : getInlineHost(serverFrameEndpoint);
  const hostCode =
    params.hostStrategy === "function" || params.hostStrategy === "env-function"
      ? generateHostValue({
          servers: document.servers ?? [],
          options: {
            hostStrategy: params.hostStrategy,
            hostEnvVar: params.hostEnvVar,
            hostFunctionName: params.hostFunctionName,
            serverMapping: params.serverMapping,
            host: params.host,
          },
        })
      : undefined;

  return {
    document,
    serverFrameEndpoint,
    host,
    hostCode,
  };
}
