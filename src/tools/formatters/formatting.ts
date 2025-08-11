import type { IFormatter } from '#interfaces/IFormatter';
import { applyFormat } from '#tools/formatters/applyFormat';
import { isValidPrimitiveWithDateType } from '#tools/type-narrowing/isValidPrimitiveWithDateType';
import type { TSupportPrimitiveType } from '#tools/type-utilities/TSupportPrimitiveType';

export function formatting(initialValue: unknown, formatter: IFormatter): TSupportPrimitiveType | undefined {
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
