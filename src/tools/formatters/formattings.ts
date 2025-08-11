import type { IFormatter } from '#interfaces/IFormatter';
import { formatting } from '#tools/formatters/formatting';
import type { TSupportPrimitiveType } from '#tools/type-utilities/TSupportPrimitiveType';
import { toArray } from 'my-easy-fp';

export function formattings(initialValue: unknown, formatters: IFormatter | IFormatter[]): TSupportPrimitiveType {
  const applied = toArray(formatters).reduce<TSupportPrimitiveType>((aggregated, formatter) => {
    const formatted = formatting(aggregated, formatter);

    if (formatted != null) {
      return formatted;
    }

    return aggregated;
  }, initialValue as TSupportPrimitiveType);

  return applied;
}
