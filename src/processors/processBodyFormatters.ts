import type { IBodyFieldOption, TMultipleBodyFormatter, TSingleBodyFormatter } from '@interfaces/body/IBodyFieldOption';
import { applyFormatters } from '@tools/applyFormatters';
import { isValidPrimitiveType, typeAssert } from '@tools/typeAssert';
import { get, set } from 'dot-prop';
import { recursive } from 'merge';
import type { SetOptional, SetRequired } from 'type-fest';

export function processBodyFormatters<T extends Record<string, any>>(
  strict: boolean,
  thisFrame: T,
  field: { key: string; option: IBodyFieldOption },
  formatterArgs: SetRequired<IBodyFieldOption, 'formatters'>['formatters'],
) {
  const { key: thisFrameAccessKey, option } = field;
  const value: any = thisFrame[thisFrameAccessKey];
  const formatters: TMultipleBodyFormatter = Array.isArray(formatterArgs)
    ? formatterArgs
    : [{ ...formatterArgs, findFrom: option.replaceAt ?? thisFrameAccessKey }];

  // case 01. primitive type & Date instance
  if (isValidPrimitiveType(value)) {
    const resultAccessKey = option.replaceAt ?? thisFrameAccessKey;
    const formattersApplied = formatters.reduce(
      (processing, formatter) => {
        try {
          const childValue = get<any>(processing, resultAccessKey);

          if (typeAssert(strict, childValue) === false) {
            return processing;
          }

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
  if (typeof value === 'object' && Array.isArray(value)) {
    const resultAccessKey = option.replaceAt ?? thisFrameAccessKey;
    const formattersApplied = formatters.reduce(
      (processing, formatter) => {
        try {
          const childValue = get<any>(processing, resultAccessKey);

          if (typeAssert(strict, childValue) === false) {
            return processing;
          }

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

  // case 03. object of complex type
  if (typeof value === 'object') {
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
          const childValue = get<any>(value, formatter.findFrom);
          if (typeAssert(strict, childValue) === false) {
            return {};
          }

          const formatted = applyFormatters(childValue, formatter);
          return set({}, formatter.findFrom, formatted);
        } catch {
          return undefined;
        }
      })
      .filter((formatted) => formatted !== undefined && formatted !== null)
      .reduce((aggregation, formatted) => recursive(aggregation, { [resultAccessKey]: formatted }), {
        [resultAccessKey]: value,
      });

    return formattersApplied;
  }

  typeAssert(strict, value);

  return value;
}
