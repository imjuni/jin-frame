import type { IFormatter } from '@interfaces/IFormatter';
import formatISO from 'date-fns/formatISO';
import { isNotEmpty } from 'my-easy-fp';

function applyFormatter(initialValue: string | boolean | number | Date, formatter: IFormatter) {
  let formatted = initialValue;

  if (typeof formatted === 'number' || typeof formatted === 'boolean') {
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

export function applyFormatters(initialValue: string | Date | number | boolean, formatter: IFormatter): string;
export function applyFormatters(
  initialValue: string[] | Date[] | number[] | boolean[],
  formatter: IFormatter,
): string[];
export function applyFormatters(
  initialValue: string | Date | number | boolean | string[] | Date[] | number[] | boolean[],
  formatter: IFormatter,
) {
  if (Array.isArray(initialValue)) {
    return initialValue.map((value) => applyFormatter(value, formatter));
  }

  return applyFormatter(initialValue, formatter);
}
