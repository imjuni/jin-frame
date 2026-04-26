import type { Formatter } from '#interfaces/options/Formatter';
import { formatting } from '#tools/formatters/formatting';
import type { SupportPrimitiveType } from '#tools/type-utilities/SupportPrimitiveType';
import { toArray } from 'my-easy-fp';

export function formattings(initialValue: unknown, formatters: Formatter | Formatter[]): SupportPrimitiveType {
  const applied = toArray(formatters).reduce<SupportPrimitiveType>((aggregated, formatter) => {
    const formatted = formatting(aggregated, formatter);

    if (formatted != null) {
      return formatted;
    }

    return aggregated;
  }, initialValue as SupportPrimitiveType);

  return applied;
}
