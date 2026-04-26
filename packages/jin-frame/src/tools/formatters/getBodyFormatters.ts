import type { SingleBodyFormatter } from '#interfaces/field/body/SingleBodyFormatter';

export function getBodyFormatters(formatters?: SingleBodyFormatter | SingleBodyFormatter[]): SingleBodyFormatter[] {
  if (formatters == null) {
    return [];
  }

  if (!Array.isArray(formatters)) {
    return [formatters];
  }

  return formatters;
}
