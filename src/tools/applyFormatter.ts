import type { IFormatter } from '@interfaces/IFormatter';
import formatISO from 'date-fns/formatISO';
import { isNotEmpty } from 'my-easy-fp';

export function applyFormatter(initialValue: string | Date | number, formatter: IFormatter) {
  let formatted = initialValue;

  if (typeof formatted === 'number') {
    formatted = `${formatted}`;
  }

  // stage 01. string format processing
  if (isNotEmpty(formatter.string) && typeof formatted === 'string') {
    formatted = formatter.string(formatted);
  }

  // stage 02. date format processing
  if (isNotEmpty(formatter.dateTime) && formatted instanceof Date) {
    formatted = formatter.dateTime(formatted);
  }

  // stage 03. force convert date instance to string
  if (isNotEmpty(formatted) && formatted instanceof Date) {
    formatted = formatISO(formatted);
  }

  return formatted;
}
