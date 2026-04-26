import type { Formatter } from '#interfaces/options/Formatter';
import { bodyFormatting } from '#tools/formatters/bodyFormatting';
import { toArray } from 'my-easy-fp';

export function bodyFormattings(initialValue: unknown, formatters: Formatter | Formatter[]): unknown {
  const applied = toArray(formatters).reduce<unknown>((aggregated, formatter) => {
    const formatted = bodyFormatting(aggregated, formatter);

    if (formatted != null) {
      return formatted;
    }

    return aggregated;
  }, initialValue);

  return applied;
}
