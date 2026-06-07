import type { IServerFrameEndpoint } from "#generators/frames/interfaces/IServerFrameEndpoint.js";
import { safeUrl } from "#tools/safeUrl.js";

export function splitServerUrl(value: string): Pick<IServerFrameEndpoint, "host" | "pathPrefix"> {
  const templateMatched = value.match(/^([A-Za-z][A-Za-z0-9+.-]*:\/\/[^/]+)(\/.*)?$/);

  if (templateMatched != null && value.includes("{")) {
    return {
      host: templateMatched[1],
      pathPrefix: templateMatched[2],
    };
  }

  const absoluteUrl = safeUrl(value);

  if (absoluteUrl != null) {
    const pathPrefix = absoluteUrl.pathname !== "/" ? absoluteUrl.pathname : undefined;
    return { host: absoluteUrl.origin, pathPrefix };
  }

  const matched = value.match(/^([A-Za-z][A-Za-z0-9+.-]*:\/\/[^/]+)(\/.*)?$/);

  if (matched != null) {
    return {
      host: matched[1],
      pathPrefix: matched[2],
    };
  }

  if (value.startsWith("/")) {
    return { pathPrefix: value };
  }

  return { host: value };
}
