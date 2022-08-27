/* eslint-disable import/no-extraneous-dependencies */

import type { IFormatter } from '@interfaces/IFormatter';
import formatISO from 'date-fns/formatISO';
import { isNotEmpty } from 'my-easy-fp';

function applyFormatter(initialValue: string | boolean | number | Date, formatter: IFormatter) {
  const orders = formatter.order ?? ['number', 'string', 'dateTime'];

  const formatted: any = orders.reduce((processing, order) => {
    // stage 01. number format processing
    if (order === 'number' && isNotEmpty(formatter.number) && typeof processing === 'number') {
      return formatter.number(processing);
    }

    // stage 02. string format processing
    if (
      order === 'string' &&
      isNotEmpty(formatter.string) &&
      (typeof processing === 'string' || typeof processing === 'boolean' || typeof processing === 'number')
    ) {
      if (typeof processing === 'number' || typeof processing === 'boolean') {
        return formatter.string(`${processing}`);
      }

      return formatter.string(processing);
    }

    // stage 03. date format processing
    if (order === 'dateTime' && isNotEmpty(formatter.dateTime) && processing instanceof Date) {
      return formatter.dateTime(processing);
    }

    return processing;
  }, initialValue);

  // stage 03. force convert date instance to string
  if (isNotEmpty(formatted) && formatted instanceof Date) {
    return formatISO(formatted);
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
