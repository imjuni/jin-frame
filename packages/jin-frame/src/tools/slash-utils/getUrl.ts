import { absoluteUrlPattern } from "#tools/slash-utils/absoluteUrlPattern";
import { hostUrlPattern } from "#tools/slash-utils/hostUrlPattern";
import { pathUrlPattern } from "#tools/slash-utils/pathUrlPattern";
import { removeBothSlash } from "#tools/slash-utils/removeBothSlash";

export function getUrl(
  host?: string,
  pathPrefix?: string,
  path?: string,
): { url: URL; str: string; pathname: string; isOnlyPath: boolean } {
  const withPathPrefix =
    pathPrefix == null && path == null
      ? undefined
      : [pathPrefix ?? "", path ?? ""]
          .map((part) => part.trim())
          .map((part) => removeBothSlash(part))
          .join("/");
  const concatted = [host ?? "", withPathPrefix ?? ""]
    .map((part) => part.trim())
    .map((part) => removeBothSlash(part))
    .join("/");
  const str = concatted === "/" ? concatted : removeBothSlash(concatted);

  // protocol + hostname + path
  if (absoluteUrlPattern.test(str)) {
    const url = new URL(str);
    return { url, str, pathname: url.pathname, isOnlyPath: false };
  }

  // hostname + empty path
  if (host != null && withPathPrefix == null && hostUrlPattern.test(str)) {
    const url = new URL(`http://${str}`);
    return { url, str, pathname: url.pathname, isOnlyPath: false };
  }

  // path
  if (host == null && withPathPrefix != null && pathUrlPattern.test(`/${str}`)) {
    const url = new URL(`http://localhost/${str}`);
    return { url, str, pathname: url.pathname, isOnlyPath: true };
  }

  if (str === "/") {
    const url = new URL("http://localhost");
    return { url, str, pathname: url.pathname, isOnlyPath: true };
  }

  // path
  const url = new URL(`http://localhost/${str}`);
  return { url, str, pathname: url.pathname, isOnlyPath: true };
}
