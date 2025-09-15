import type { OpenAPIV3 } from 'openapi-types';
import { safeUrl } from '#/tools/safeUrl';
import urlJoin from 'url-join';

interface IGetServerUrlParams {
  specUrl: URL;
  server: OpenAPIV3.ServerObject;
}

interface IGetServerUrlReturn {
  url: URL;
  prefix?: string;
}

export function getServerUrl(params: IGetServerUrlParams): IGetServerUrlReturn {
  const serverUrl = safeUrl(params.server.url);

  // server url can be used as is
  if (serverUrl != null) {
    return { url: serverUrl };
  }

  // if server url is not a full url, combine spec url and server url
  const next = new URL(params.specUrl.href);
  next.pathname = urlJoin(next.pathname, params.server.url);
  return { url: next, prefix: params.server.url };
}
