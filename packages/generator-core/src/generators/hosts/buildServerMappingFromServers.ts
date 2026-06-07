import type { OpenAPIV3 } from "openapi-types";

export function buildServerMappingFromServers(servers: OpenAPIV3.ServerObject[]): Record<string, string> {
  const mapping: Record<string, string> = {};

  servers.forEach((server, index) => {
    const { url } = server;
    const description = server.description?.toLowerCase() ?? "";

    if (url.includes("dev") || description.includes("dev")) {
      mapping.development = url;
    } else if (url.includes("staging") || description.includes("staging")) {
      mapping.staging = url;
    } else if (url.includes("prod") || description.includes("prod") || index === servers.length - 1) {
      mapping.production = url;
    } else {
      mapping[`server${index}`] = url;
    }
  });

  if (!mapping.development && servers.length > 0) {
    const firstServer = servers.at(0);
    if (firstServer != null) {
      mapping.development = firstServer.url;
    }
  }

  return mapping;
}
