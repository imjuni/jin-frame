import { getServerUrl } from '#/generators/hosts/getServerUrl';
import { safeUrl } from '#/tools/safeUrl';
import type { OpenAPIV3 } from 'openapi-types';

interface IGetHostParams {
  host?: string;
  specTypeFilePath: string;
  document: OpenAPIV3.Document;
}

export function getHost(params: IGetHostParams): string {
  if (params.host != null) {
    return params.host;
  }

  // Try absolute server URLs from the document first (specUrl not required)
  if (params.document.servers != null && params.document.servers.length > 0) {
    for (const server of params.document.servers) {
      const serverUrl = safeUrl(server.url);
      if (serverUrl != null) {
        return serverUrl.href;
      }
    }
  }

  // Fall back to relative server URL as-is (e.g. "/api/v3") when specTypeFilePath is a local path
  if (params.document.servers != null && params.document.servers.length > 0) {
    const firstServer = params.document.servers[0];
    if (firstServer.url) {
      // Try to resolve with specUrl if available
      const specUrl = safeUrl(params.specTypeFilePath);
      if (specUrl != null) {
        return getServerUrl({ specUrl, server: firstServer }).url.href;
      }
      // Use relative server URL as-is
      return firstServer.url;
    }
  }

  // Last resort: use specTypeFilePath itself as the host
  const specUrl = safeUrl(params.specTypeFilePath);
  if (specUrl != null) {
    return specUrl.href;
  }

  throw new Error(
    `Cannot determine host: specTypeFilePath "${params.specTypeFilePath}" is not a valid URL and no usable server URL found`,
  );
}
