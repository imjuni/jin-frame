import { getJsonArgument } from "#/generators/json/getJsonArgument.js";
import type { IJsonLiteralValue } from "#/generators/json/interface/IJsonLiteralValue.js";
import type { ICreateBaseFrameProps } from "#/generators/base-frame/interfaces/ICreateBaseFrameProps.js";

export function getFrameDecoratorArgument(
  params: Pick<ICreateBaseFrameProps, "host" | "hostCode" | "pathPrefix" | "pathPrefixCode">,
): string {
  const values: IJsonLiteralValue[] = [];

  if (params.hostCode != null) {
    values.push({ key: "host", value: params.hostCode, isFunction: true });
  } else if (params.host != null) {
    values.push({
      key: "host",
      value: params.host,
      isFunction: typeof params.host === "function",
    });
  }

  if (params.pathPrefixCode != null) {
    values.push({ key: "pathPrefix", value: params.pathPrefixCode, isFunction: true });
  } else if (params.pathPrefix != null) {
    values.push({
      key: "pathPrefix",
      value: params.pathPrefix,
      isFunction: typeof params.pathPrefix === "function",
    });
  }

  return getJsonArgument({ values }) ?? "{}";
}
