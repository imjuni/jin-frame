import type { Formatter } from '#interfaces/options/Formatter';
import { applyFormat } from '#tools/formatters/applyFormat';
import { isValidPrimitiveWithDateType } from '#tools/type-narrowing/isValidPrimitiveWithDateType';
import type { SupportPrimitiveType } from '#tools/type-utilities/SupportPrimitiveType';

export function formatting(initialValue: unknown, formatter: Formatter): SupportPrimitiveType | undefined {
  try {
    const applied = applyFormat(initialValue, formatter);

    if (isValidPrimitiveWithDateType(applied)) {
      return applied;
    }

    return JSON.stringify(applied);
  } catch (err) {
    if (formatter.ignoreError != null && !formatter.ignoreError) {
      throw err;
    }

    return undefined;
  }
}
