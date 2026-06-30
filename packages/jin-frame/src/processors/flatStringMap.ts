import { stringifyExceptString } from "#tools/formatters/stringifyExceptString";

export function flatStringMap(map: Record<string, string | string[] | undefined>): Record<string, string> {
  return Object.keys(map).reduce<Record<string, string>>((aggregated, key) => {
    const values = map[key];

    if (values != null && Array.isArray(values)) {
      aggregated[key] = values.map((value) => stringifyExceptString(value)).join(",");
      return aggregated;
    }

    if (values != null) {
      aggregated[key] = values;
    }

    return aggregated;
  }, {});
}
