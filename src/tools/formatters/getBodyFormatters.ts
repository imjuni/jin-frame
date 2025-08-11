import type { TSingleBodyFormatter } from '#interfaces/body/TSingleBodyFormatter';

export function getBodyFormatters(formatters?: TSingleBodyFormatter | TSingleBodyFormatter[]): TSingleBodyFormatter[] {
  if (formatters == null) {
    return [];
  }

  if (!Array.isArray(formatters)) {
    return [formatters];
  }

  return formatters;
}
