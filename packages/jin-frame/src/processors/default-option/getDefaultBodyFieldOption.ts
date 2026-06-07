import type { Except } from "type-fest";
import type { BodyFieldOption } from "#interfaces/field/body/BodyFieldOption";

export function getDefaultBodyFieldOption(
  option?: Partial<BodyFieldOption> | Except<Partial<BodyFieldOption>, "type">,
): BodyFieldOption {
  return {
    key: "",
    type: "body",
    cacheKeyExcludePaths: option?.cacheKeyExcludePaths ?? undefined,
    replaceAt: option?.replaceAt ?? undefined,
    formatters: option?.formatters ?? undefined,
    encode: option?.encode ?? true,
  };
}
