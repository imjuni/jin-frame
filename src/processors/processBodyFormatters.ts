import type { IBodyFieldOption, TMultipleBodyFormatter, TSingleBodyFormatter } from '#interfaces/body/IBodyFieldOption';
import applyFormatters from '#tools/formatters/applyFormatters';
import isValidArrayType from '#tools/type-narrowing/isValidArrayType';
import isValidPrimitiveType from '#tools/type-narrowing/isValidPrimitiveType';
import typeAssert from '#tools/type-narrowing/typeAssert';
import type TSupportArrayType from '#tools/type-utilities/TSupportArrayType';
import type TSupportPrimitiveType from '#tools/type-utilities/TSupportPrimitiveType';
import { get, set } from 'dot-prop';
import { recursive } from 'merge';
import type { SetOptional, SetRequired } from 'type-fest';

export function processBodyFormatters<T extends Record<string, unknown>>(
  strict: boolean,
  thisFrame: T,
  field: { key: string; option: IBodyFieldOption },
  formatterArgs: SetRequired<IBodyFieldOption, 'formatters'>['formatters'],
) {
  const { key: thisFrameAccessKey, option } = field;
  const value: unknown = thisFrame[thisFrameAccessKey];
  const formatters: TMultipleBodyFormatter = Array.isArray(formatterArgs)
    ? formatterArgs
    : [{ ...formatterArgs, findFrom: option.replaceAt ?? thisFrameAccessKey }];

  // case 01. primitive type & Date instance
  if (isValidPrimitiveType(value)) {
    const resultAccessKey = option.replaceAt ?? thisFrameAccessKey;
    const formattersApplied = formatters.reduce<Record<string, TSupportPrimitiveType>>(
      (processing, formatter) => {
        try {
          const childValue = get<string | boolean | number | Date>(processing, resultAccessKey)!;
          const formatted = applyFormatters(childValue, formatter);
          return set({ ...processing }, resultAccessKey, formatted);
        } catch {
          return processing;
        }
      },
      { [resultAccessKey]: value },
    );

    return formattersApplied;
  }

  // case 02. array of primitive type & array of Date instance
  if (Array.isArray(value) && isValidArrayType(value)) {
    const resultAccessKey = option.replaceAt ?? thisFrameAccessKey;
    const formattersApplied = formatters.reduce<Record<string, TSupportArrayType>>(
      (processing, formatter) => {
        const childValue = get<TSupportArrayType>(processing, resultAccessKey)!;
        const formatted = applyFormatters(childValue, formatter);
        return set({ ...processing }, resultAccessKey, formatted);
      },
      { [resultAccessKey]: value },
    );

    return formattersApplied;
  }

  // case 03. object of complex type
  if (typeof value === 'object' && !Array.isArray(value) && value != null) {
    const resultAccessKey = option.replaceAt ?? thisFrameAccessKey;

    const validFormatters = formatters.filter(
      (formatter): formatter is SetRequired<TSingleBodyFormatter, 'findFrom'> => formatter.findFrom != null,
    );

    const invalidFormatters = formatters.filter(
      (formatter): formatter is SetOptional<TSingleBodyFormatter, 'findFrom'> => formatter.findFrom == null,
    );

    if (strict && invalidFormatters.length > 0) {
      throw new Error(`object type formatters need findFrom: ${thisFrameAccessKey}/${invalidFormatters.length}`);
    }

    const formattersApplied = validFormatters
      .map((formatter) => {
        try {
          const childValue = get<unknown>(value, formatter.findFrom);
          if (!typeAssert(strict, childValue)) {
            return value;
          }

          const formatted = applyFormatters(childValue, formatter);
          return set({}, formatter.findFrom, formatted) as object;
        } catch {
          return value;
        }
      })
      .reduce(
        (aggregation, formatted) => recursive(aggregation, { [resultAccessKey]: formatted }) as Record<string, unknown>,
        {
          [resultAccessKey]: value,
        },
      );

    return formattersApplied;
  }

  typeAssert(strict, value);

  return thisFrame;
}
