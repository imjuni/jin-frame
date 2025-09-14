import type { TSingleBodyFormatter } from '#interfaces/field/body/TSingleBodyFormatter';
import { applyFormat } from '#tools/formatters/applyFormat';
import { findFromBody } from '#tools/formatters/findFromBody';
import { setToBody } from '#tools/formatters/setToBody';

export function bodyFormatting(initialValue: unknown, formatter: TSingleBodyFormatter): unknown {
  const origin = findFromBody(initialValue, formatter.findFrom);

  try {
    const formatted = applyFormat(origin, formatter);
    const next = setToBody(initialValue, formatted, formatter.findFrom);
    return next;
  } catch (err) {
    if (formatter.ignoreError != null && !formatter.ignoreError) {
      throw err;
    }

    return undefined;
  }
}
