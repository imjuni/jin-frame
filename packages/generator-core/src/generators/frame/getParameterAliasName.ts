import { parameterAliasMap } from "#generators/frame/parameterAliasMap.js";

export function getParameterAliasName(
  decorator: keyof typeof parameterAliasMap,
  used: Set<keyof typeof parameterAliasMap>,
): string {
  return used.size === 1 ? "FrameRequestParameter" : parameterAliasMap[decorator].aliasName;
}
