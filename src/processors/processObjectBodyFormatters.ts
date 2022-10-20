import { IObjectBodyFieldOption, TMultipleObjectBodyFormatter } from '@interfaces/body/IObjectBodyFieldOption';
import { applyFormatters } from '@tools/applyFormatters';
import { typeAssert } from '@tools/typeAssert';
import { get, set } from 'dot-prop';
import { recursive } from 'merge';
import { first } from 'my-easy-fp';
import { SetRequired } from 'type-fest';

export function processObjectBodyFormatters<T extends Record<string, any>>(
  strict: boolean,
  thisFrame: T,
  field: { key: string; option: IObjectBodyFieldOption },
  formatterArgs: SetRequired<IObjectBodyFieldOption, 'formatters'>['formatters'],
) {
  const { key: thisFrameAccessKey } = field;
  const value: any = thisFrame[thisFrameAccessKey];
  const formatters: TMultipleObjectBodyFormatter = Array.isArray(formatterArgs)
    ? formatterArgs
    : [{ ...formatterArgs, findFrom: formatterArgs.findFrom }];

  // case 01. array of primitive type & array of Date instance
  if (typeof value === 'object' && Array.isArray(value) && typeAssert(strict, first(value))) {
    const formattersApplied = formatters.reduce(
      (processing, formatter) => {
        try {
          return applyFormatters(processing, formatter);
        } catch {
          return processing;
        }
      },
      [...value],
    );

    return formattersApplied;
  }

  // case 02. array of user-defined type & array of Date instance
  if (typeof value === 'object' && Array.isArray(value)) {
    const formattersAppliedArray = value.map((eachValue) => {
      const formattersApplied = formatters.reduce((aggregation, formatter) => {
        try {
          const childValue = get<any>(aggregation, formatter.findFrom);
          if (typeAssert(strict, childValue) === false) {
            return {};
          }

          const formatted = applyFormatters(childValue, formatter);
          return set(aggregation, formatter.findFrom, formatted);
        } catch {
          return aggregation;
        }
      }, eachValue);

      return formattersApplied;
    });

    return formattersAppliedArray;
  }

  // case 03. object of Date instance
  if (typeof value === 'object' && value instanceof Date) {
    const formattersApplied = formatters.reduce<Date | string>((aggregation, formatter) => {
      try {
        const formatted = applyFormatters(aggregation, formatter);
        return formatted;
      } catch {
        return aggregation;
      }
    }, value);

    return formattersApplied;
  }

  // case 04. object of complex type
  if (typeof value === 'object') {
    const formattersApplied = formatters
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
      .reduce((aggregation, formatted) => recursive(aggregation, formatted), { ...value });

    return formattersApplied;
  }

  typeAssert(strict, value);

  return value;
}
