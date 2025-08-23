import type { IFormatter } from '#interfaces/options/IFormatter';
import { isValidPrimitiveType } from '#tools/type-narrowing/isValidPrimitiveType';

export function applyFormat(origin: unknown, formatter: IFormatter): unknown {
  const orders = formatter.order ?? ['number', 'string', 'dateTime'];

  const formatted = orders.reduce((processing, order) => {
    // stage 01. number format processing
    if (order === 'number' && formatter.number != null && typeof processing === 'number') {
      return formatter.number(processing);
    }

    // stage 02. string format processing
    if (order === 'string' && formatter.string != null && isValidPrimitiveType(processing)) {
      if (typeof processing === 'number' || typeof processing === 'boolean') {
        return formatter.string(processing.toString());
      }

      return formatter.string(processing);
    }

    // stage 03. date format processing
    if (order === 'dateTime' && formatter.dateTime != null && processing instanceof Date) {
      return formatter.dateTime(processing);
    }

    return processing;
  }, origin);

  return formatted;
}
