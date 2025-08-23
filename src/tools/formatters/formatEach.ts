import type { IFormatter } from '#interfaces/options/IFormatter';
import { formattings } from '#tools/formatters/formattings';
import type { TSupportPrimitiveType } from '#tools/type-utilities/TSupportPrimitiveType';

export function formatEach(
  initialValue: unknown,
  formatters: IFormatter | IFormatter[],
): TSupportPrimitiveType | TSupportPrimitiveType[] {
  if (Array.isArray(initialValue)) {
    return initialValue.map((value) => formattings(value, formatters));
  }

  return formattings(initialValue, formatters);
}
