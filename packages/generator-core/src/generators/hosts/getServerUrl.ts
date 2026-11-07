import type { IGetServerUrlParams } from "#generators/hosts/interfaces/IGetServerUrlParams.js";
import type { IGetServerUrlReturn } from "#generators/hosts/interfaces/IGetServerUrlReturn.js";
import { safeUrl } from "#tools/safeUrl.js";

export function getServerUrl({ specUrl, server }: IGetServerUrlParams): IGetServerUrlReturn {
  const serverUrl = safeUrl(server.url);

  // server url can be used as is
  if (serverUrl != null) {
    return { url: serverUrl };
  }

  // Resolve relative servers against the specification URL using URL reference semantics.
  return { url: new URL(server.url, specUrl), prefix: server.url };
}
