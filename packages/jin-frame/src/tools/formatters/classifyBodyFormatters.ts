import type { SingleBodyFormatter } from '#interfaces/field/body/SingleBodyFormatter';
import type { SetOptional, SetRequired } from 'type-fest';

export function classifyBodyFormatters(formatters?: SingleBodyFormatter[]): {
  valid: SetRequired<SingleBodyFormatter, 'findFrom'>[];
  invalid: SetOptional<SingleBodyFormatter, 'findFrom'>[];
} {
  if (formatters == null) {
    return { valid: [], invalid: [] };
  }

  const result = formatters.reduce<{
    valid: SetRequired<SingleBodyFormatter, 'findFrom'>[];
    invalid: SetOptional<SingleBodyFormatter, 'findFrom'>[];
  }>(
    (aggregated, formatter) => {
      if (formatter.findFrom != null) {
        return {
          ...aggregated,
          valid: [...aggregated.valid, formatter as SetRequired<SingleBodyFormatter, 'findFrom'>],
        };
      }

      return { ...aggregated, invalid: [...aggregated.invalid, formatter] };
    },
    { valid: [], invalid: [] },
  );

  return result;
}
