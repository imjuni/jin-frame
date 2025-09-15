import { removeBothSlash } from '#tools/slash-utils/removeBothSlash';

// 1) protocol + hostname + path (RFC 3986 scheme, path value is case-sensitive)
const pattern1 = /^([A-Za-z][A-Za-z0-9+.-]*:\/\/)([A-Za-z0-9.-]+)(\/.*)?$/i;

// 2) hostname + path (hostname은 TLD 포함, ignore case / path는 case-sensitive)
const pattern2 = /^([A-Za-z0-9-]+\.[A-Za-z]{2,})(\/.*)?$/i;

// 3) only path (case-sensitive)
const pattern3 = /^(\/.*)$/;

export function getUrl(
  host?: string,
  pathPrefix?: string,
  path?: string,
): { url: URL; str: string; pathname: string; isOnlyPath: boolean } {
  const withPathPrefix =
    pathPrefix == null && path == null
      ? undefined
      : [pathPrefix ?? '', path ?? '']
          .map((part) => part.trim())
          .map((part) => removeBothSlash(part))
          .join('/');
  const concatted = [host ?? '', withPathPrefix ?? '']
    .map((part) => part.trim())
    .map((part) => removeBothSlash(part))
    .join('/');
  const str = concatted === '/' ? concatted : removeBothSlash(concatted);

  // protocol + hostname + path
  if (pattern1.test(str)) {
    const url = new URL(str);
    return { url, str, pathname: url.pathname, isOnlyPath: false };
  }

  // hostname + empty path
  if (host != null && withPathPrefix == null && pattern2.test(str)) {
    const url = new URL(`http://${str}`);
    return { url, str, pathname: url.pathname, isOnlyPath: false };
  }

  // path
  if (host == null && withPathPrefix != null && pattern3.test(`/${str}`)) {
    const url = new URL(`http://localhost/${str}`);
    return { url, str, pathname: url.pathname, isOnlyPath: true };
  }

  if (str === '/') {
    const url = new URL('http://localhost');
    return { url, str, pathname: url.pathname, isOnlyPath: true };
  }

  // path
  const url = new URL(`http://localhost/${str}`);
  return { url, str, pathname: url.pathname, isOnlyPath: true };
}
