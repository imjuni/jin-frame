import type { IServerFrameEndpoint } from "#generators/frames/interfaces/IServerFrameEndpoint.js";

export function getInlineHost(endpoint: IServerFrameEndpoint): string {
  if (endpoint.host != null && endpoint.pathPrefix != null) {
    return `${endpoint.host}${endpoint.pathPrefix}`;
  }

  return endpoint.host ?? endpoint.pathPrefix ?? "";
}
