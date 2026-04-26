import type { SingleBodyFormatter } from '#interfaces/field/body/SingleBodyFormatter';
import { bodyFormattings } from '#tools/formatters/bodyFormattings';

export function bodyFormatEach(
  initialValue: unknown,
  formatters: SingleBodyFormatter | SingleBodyFormatter[],
): unknown {
  if (Array.isArray(initialValue)) {
    return initialValue.map((value) => bodyFormattings(value, formatters));
  }

  return bodyFormattings(initialValue, formatters);
}
