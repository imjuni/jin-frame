import type { OpenAPIV3 } from "openapi-types";
import { buildServerMappingFromServers } from "#/generators/hosts/buildServerMappingFromServers";
import type { IHostStrategyOptions } from "#/generators/hosts/interfaces/IHostStrategyOptions";

export function generateEnvFunction(
  servers: OpenAPIV3.ServerObject[],
  options: Pick<IHostStrategyOptions, "hostEnvVar" | "serverMapping">,
): string {
  const envVar = options.hostEnvVar ?? "NODE_ENV";
  const serverMapping = options.serverMapping ?? buildServerMappingFromServers(servers);

  const mappingEntries = Object.entries(serverMapping)
    .map(([env, url]) => `    ${env}: '${url}'`)
    .join(",\n");

  const defaultServer = servers.at(0)?.url ?? "";

  return `() => {
    const env = process.env.${envVar} ?? 'development';
    const servers = {
${mappingEntries}
    };
    return servers[env] ?? '${defaultServer}';
  }`;
}
