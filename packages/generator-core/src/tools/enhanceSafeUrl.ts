import urlJoin from "url-join";
import { CE_URL_TEMP_KEY } from "#tools/const-enum/CE_URL_TEMP_KEY.js";
import { safeUrl } from "#tools/safeUrl.js";

export function enhanceSafeUrl(value: string): { key?: string; url: URL } | undefined {
  try {
    const tryOrigin = safeUrl(value);

    if (tryOrigin != null) {
      return { key: undefined, url: tryOrigin };
    }

    const attached = `${CE_URL_TEMP_KEY.PROTOCOL}${CE_URL_TEMP_KEY.HOST}`;
    return { key: attached, url: new URL(urlJoin(attached, value)) };
  } catch {
    return undefined;
  }
}
