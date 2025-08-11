import { stringifyExceptString } from '#tools/formatters/stringifyExceptString';

export function flatStringMap(map: Record<string, string | string[]>): Record<string, string> {
  return Object.keys(map).reduce<Record<string, string>>((aggregated, key) => {
    const values = map[key];

    if (values != null && Array.isArray(values)) {
      return { ...aggregated, [key]: values.map((value) => stringifyExceptString(value)).join(',') };
    }

    if (values != null) {
      return { ...aggregated, [key]: values };
    }

    return aggregated;
  }, {});
}
