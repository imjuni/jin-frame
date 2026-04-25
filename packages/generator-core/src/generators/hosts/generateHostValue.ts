import type { OpenAPIV3 } from 'openapi-types';
export interface IHostStrategyOptions {
  hostStrategy?: 'string' | 'function' | 'env-function';
  hostEnvVar?: string;
  hostFunctionName?: string;
  serverMapping?: Record<string, string>;
  host?: string;
}

export interface IGenerateHostValueParams {
  servers: OpenAPIV3.ServerObject[];
  options: IHostStrategyOptions;
}

/**
 * Generate host value based on strategy
 */
export function generateHostValue(params: IGenerateHostValueParams): string {
  const { servers, options } = params;
  const strategy = options.hostStrategy || 'string';

  // If host is explicitly provided in options, use it
  if (options.host) {
    return strategy === 'string' ? `'${options.host}'` : `() => '${options.host}'`;
  }

  // Use first server as default
  const primaryServer = servers[0];
  if (!primaryServer) {
    throw new Error('No servers found in OpenAPI specification');
  }

  switch (strategy) {
    case 'string':
      return `'${primaryServer.url}'`;

    case 'function':
      const functionName = options.hostFunctionName || 'getApiHost';
      return functionName;

    case 'env-function':
      return generateEnvFunction(servers, options);

    default:
      throw new Error(`Unknown host strategy: ${strategy}`);
  }
}

/**
 * Generate environment-based function for host selection
 */
function generateEnvFunction(
  servers: OpenAPIV3.ServerObject[],
  options: Pick<IGeneratorOption, 'hostEnvVar' | 'serverMapping'>
): string {
  const envVar = options.hostEnvVar || 'NODE_ENV';

  // Build server mapping from servers array or provided mapping
  const serverMapping = options.serverMapping || buildServerMappingFromServers(servers);

  const mappingEntries = Object.entries(serverMapping)
    .map(([env, url]) => `    ${env}: '${url}'`)
    .join(',\n');

  const defaultServer = servers[0].url;

  return `() => {
    const env = process.env.${envVar} || 'development';
    const servers = {
${mappingEntries}
    };
    return servers[env] || '${defaultServer}';
  }`;
}

/**
 * Build server mapping from servers array by analyzing URLs
 */
function buildServerMappingFromServers(servers: OpenAPIV3.ServerObject[]): Record<string, string> {
  const mapping: Record<string, string> = {};

  servers.forEach((server, index) => {
    // Try to detect environment from URL or description
    const url = server.url;
    const description = server.description?.toLowerCase() || '';

    if (url.includes('dev') || description.includes('dev')) {
      mapping.development = url;
    } else if (url.includes('staging') || description.includes('staging')) {
      mapping.staging = url;
    } else if (url.includes('prod') || description.includes('prod') || index === servers.length - 1) {
      mapping.production = url;
    } else {
      // Fallback: use index-based naming
      mapping[`server${index}`] = url;
    }
  });

  // Ensure at least development exists
  if (!mapping.development && servers.length > 0) {
    mapping.development = servers[0].url;
  }

  return mapping;
}