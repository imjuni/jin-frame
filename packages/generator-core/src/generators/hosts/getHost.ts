import { getServerUrl } from '#/generators/hosts/getServerUrl';
import { safeUrl } from '#/tools/safeUrl';
import type { OpenAPIV3 } from 'openapi-types';

export interface IGetHostParams {
  host?: string;
  specTypeFilePath: string;
  document: OpenAPIV3.Document;
}

export function getHost(params: IGetHostParams): string {
  if (params.host != null && params.host.trim() !== '') {
    return params.host;
  }

  const specUrl = safeUrl(params.specTypeFilePath);

  if (specUrl == null) {
    throw new Error(`Failed to parse spec URL: ${params.specTypeFilePath}`);
  }

  // 2. document의 servers 섹션에서 첫 번째 서버 URL 추출
  if (params.document.servers != null && params.document.servers.length > 0) {
    const servers = params.document.servers
      .map((server) => getServerUrl({ specUrl, server }))
      .filter((url) => url != null);
    const firstServer = servers.at(0);

    if (firstServer != null) {
      return firstServer.url.href;
    }
  }

  // 3. 백업: specTypeFilePath에서 호스트 추출 시도
  return specUrl.href;
}
