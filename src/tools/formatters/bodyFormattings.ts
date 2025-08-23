import type { IFormatter } from '#interfaces/options/IFormatter';
import { bodyFormatting } from '#tools/formatters/bodyFormatting';
import { toArray } from 'my-easy-fp';

export function bodyFormattings(initialValue: unknown, formatters: IFormatter | IFormatter[]): unknown {
  const applied = toArray(formatters).reduce<unknown>((aggregated, formatter) => {
    const formatted = bodyFormatting(aggregated, formatter);

    if (formatted != null) {
      return formatted;
    }

    return aggregated;
  }, initialValue);

  return applied;
}
