import type { Formatter } from '#interfaces/options/Formatter';
import { formattings } from '#tools/formatters/formattings';
import type { SupportPrimitiveType } from '#tools/type-utilities/SupportPrimitiveType';

export function formatEach(
  initialValue: unknown,
  formatters: Formatter | Formatter[],
): SupportPrimitiveType | SupportPrimitiveType[] {
  if (Array.isArray(initialValue)) {
    return initialValue.map((value) => formattings(value, formatters));
  }

  return formattings(initialValue, formatters);
}
