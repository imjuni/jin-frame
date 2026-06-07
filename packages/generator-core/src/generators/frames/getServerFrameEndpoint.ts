import type { OpenAPIV3 } from "openapi-types";
import { generateHostValue } from "#/generators/hosts/generateHostValue.js";
import { getHost } from "#/generators/hosts/getHost.js";
import { getServerUrl } from "#/generators/hosts/getServerUrl.js";
import type { ICreateFramesProps } from "#/generators/frames/interfaces/ICreateFramesProps.js";
import type { IServerFrameEndpoint } from "#/generators/frames/interfaces/IServerFrameEndpoint.js";
import { splitServerUrl } from "#/generators/frames/splitServerUrl.js";
import { safeUrl } from "#/tools/safeUrl.js";

export function getServerFrameEndpoint(params: ICreateFramesProps, document: OpenAPIV3.Document): IServerFrameEndpoint {
  const server = document.servers?.at(0);

  if (params.hostStrategy === "function" || params.hostStrategy === "env-function") {
    return {
      hostCode: generateHostValue({
        servers: document.servers ?? [],
        options: {
          hostStrategy: params.hostStrategy,
          hostEnvVar: params.hostEnvVar,
          hostFunctionName: params.hostFunctionName,
          serverMapping: params.serverMapping,
          host: params.host,
        },
      }),
      serverVariables: server?.variables,
    };
  }

  if (params.host != null) {
    return { ...splitServerUrl(params.host), serverVariables: server?.variables };
  }

  if (server != null) {
    const serverUrl = safeUrl(server.url);

    if (serverUrl != null || /^([A-Za-z][A-Za-z0-9+.-]*:\/\/[^/]+)(\/.*)?$/.test(server.url)) {
      return { ...splitServerUrl(server.url), serverVariables: server.variables };
    }

    const specUrl = safeUrl(params.specFilePath ?? params.specTypeFilePath);
    if (specUrl != null) {
      const resolved = getServerUrl({ specUrl, server });
      return { ...splitServerUrl(resolved.url.href), serverVariables: server.variables };
    }

    return { pathPrefix: server.url, serverVariables: server.variables };
  }

  const fallbackHost = getHost({
    host: params.host,
    specTypeFilePath: params.specFilePath ?? params.specTypeFilePath,
    document,
  });

  return splitServerUrl(fallbackHost);
}
