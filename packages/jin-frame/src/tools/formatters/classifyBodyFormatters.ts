import type { TSingleBodyFormatter } from '#interfaces/field/body/TSingleBodyFormatter';
import type { SetOptional, SetRequired } from 'type-fest';

export function classifyBodyFormatters(formatters?: TSingleBodyFormatter[]): {
  valid: SetRequired<TSingleBodyFormatter, 'findFrom'>[];
  invalid: SetOptional<TSingleBodyFormatter, 'findFrom'>[];
} {
  if (formatters == null) {
    return { valid: [], invalid: [] };
  }

  const result = formatters.reduce<{
    valid: SetRequired<TSingleBodyFormatter, 'findFrom'>[];
    invalid: SetOptional<TSingleBodyFormatter, 'findFrom'>[];
  }>(
    (aggregated, formatter) => {
      if (formatter.findFrom != null) {
        return {
          ...aggregated,
          valid: [...aggregated.valid, formatter as SetRequired<TSingleBodyFormatter, 'findFrom'>],
        };
      }

      return { ...aggregated, invalid: [...aggregated.invalid, formatter] };
    },
    { valid: [], invalid: [] },
  );

  return result;
}
