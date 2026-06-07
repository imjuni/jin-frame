import urlJoin from "url-join";
import type { IGetServerUrlParams } from "#/generators/hosts/interfaces/IGetServerUrlParams.js";
import type { IGetServerUrlReturn } from "#/generators/hosts/interfaces/IGetServerUrlReturn.js";
import { safeUrl } from "#/tools/safeUrl.js";

export function getServerUrl({ specUrl, server }: IGetServerUrlParams): IGetServerUrlReturn {
  const serverUrl = safeUrl(server.url);

  // server url can be used as is
  if (serverUrl != null) {
    return { url: serverUrl };
  }

  // if server url is not a full url, combine spec url and server url
  const next = new URL(specUrl.href);
  next.pathname = urlJoin(next.pathname, server.url);
  return { url: next, prefix: server.url };
}
