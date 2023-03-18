import type { IFormatter } from '#interfaces/IFormatter';
import applyFormatter from '#tools/formatters/applyFormatter';

function applyFormatters(initialValue: string | Date | number | boolean, formatter: IFormatter): string;
function applyFormatters(initialValue: string[] | Date[] | number[] | boolean[], formatter: IFormatter): string[];
function applyFormatters(
  initialValue: string | Date | number | boolean | string[] | Date[] | number[] | boolean[],
  formatter: IFormatter,
): string | string[];
function applyFormatters(
  initialValue: string | Date | number | boolean | string[] | Date[] | number[] | boolean[],
  formatter: IFormatter,
) {
  if (Array.isArray(initialValue)) {
    return initialValue.map((value) => applyFormatter(value, formatter));
  }

  return applyFormatter(initialValue, formatter);
}

export default applyFormatters;
