import type { IFormatter } from '#interfaces/IFormatter';

export default function applyFormatter(initialValue: string | boolean | number | Date, formatter: IFormatter) {
  const orders = formatter.order ?? ['number', 'string', 'dateTime'];

  const formatted: any = orders.reduce((processing, order) => {
    // stage 01. number format processing
    if (order === 'number' && formatter.number != null && typeof processing === 'number') {
      return formatter.number(processing);
    }

    // stage 02. string format processing
    if (
      order === 'string' &&
      formatter.string != null &&
      (typeof processing === 'string' || typeof processing === 'boolean' || typeof processing === 'number')
    ) {
      if (typeof processing === 'number' || typeof processing === 'boolean') {
        return formatter.string(`${processing.toString()}`);
      }

      return formatter.string(processing);
    }

    // stage 03. date format processing
    if (order === 'dateTime' && formatter.dateTime != null && processing instanceof Date) {
      return formatter.dateTime(processing);
    }

    return processing;
  }, initialValue);

  return formatted as string;
}
