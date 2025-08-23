import type { TSingleBodyFormatter } from '#interfaces/field/body/TSingleBodyFormatter';
import { bodyFormattings } from '#tools/formatters/bodyFormattings';

export function bodyFormatEach(
  initialValue: unknown,
  formatters: TSingleBodyFormatter | TSingleBodyFormatter[],
): unknown {
  if (Array.isArray(initialValue)) {
    return initialValue.map((value) => bodyFormattings(value, formatters));
  }

  return bodyFormattings(initialValue, formatters);
}
