import { CE_URL_TEMP_KEY } from '#/tools/const-enum/CE_URL_TEMP_KEY';
import { safeUrl } from '#/tools/safeUrl';
import urlJoin from 'url-join';

export function enhanceSafeUrl(value: string): { key?: string; url: URL } | undefined {
  try {
    const tryOrigin = safeUrl(value);

    if (tryOrigin != null) {
      return { key: undefined, url: tryOrigin };
    }

    const attached = `${CE_URL_TEMP_KEY.PROTOCOL}${CE_URL_TEMP_KEY.HOST}`;
    const tryWithHost = safeUrl(urlJoin(attached, value));

    if (tryWithHost != null) {
      return { key: attached, url: tryWithHost };
    }

    return undefined;
  } catch {
    return undefined;
  }
}
