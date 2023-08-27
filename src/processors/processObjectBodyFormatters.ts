import type { IObjectBodyFieldOption, TMultipleObjectBodyFormatter } from '#interfaces/body/IObjectBodyFieldOption';
import applyFormatters from '#tools/formatters/applyFormatters';
import isValidArrayType from '#tools/type-narrowing/isValidArrayType';
import isValidPrimitiveType from '#tools/type-narrowing/isValidPrimitiveType';
import typeAssert from '#tools/type-narrowing/typeAssert';
import type TSupportArrayType from '#tools/type-utilities/TSupportArrayType';
import * as dotProp from 'dot-prop';
import { recursive } from 'merge';
import type { SetRequired } from 'type-fest';

export function processObjectBodyFormatters<T extends Record<string, unknown>>(
  strict: boolean,
  thisFrame: T,
  field: { key: string; option: IObjectBodyFieldOption },
  formatterArgs: SetRequired<IObjectBodyFieldOption, 'formatters'>['formatters'],
) {
  const { key: thisFrameAccessKey } = field;
  const value: unknown = thisFrame[thisFrameAccessKey];
  const formatters: TMultipleObjectBodyFormatter = Array.isArray(formatterArgs)
    ? formatterArgs
    : [{ ...formatterArgs, findFrom: formatterArgs.findFrom }];

  // case 01.  primitive type & Date instance
  if (isValidPrimitiveType(value)) {
    const formattersApplied = formatters.reduce((processing, formatter) => {
      try {
        return applyFormatters(processing, formatter);
      } catch {
        return processing;
      }
    }, value);

    return formattersApplied;
  }

  // case 02. array of primitive type & array of Date instance
  if (Array.isArray(value) && isValidArrayType(value)) {
    const formattersApplied = formatters.reduce<TSupportArrayType>((processing, formatter) => {
      try {
        return applyFormatters(processing, formatter);
      } catch {
        return processing;
      }
    }, value);

    return formattersApplied;
  }

  // case 03. array of user-defined type & array of Date instance
  if (Array.isArray(value)) {
    const formattersAppliedArray = value.map((eachValue: object) => {
      const formattersApplied = formatters.reduce<object>((aggregation, formatter) => {
        try {
          const childValue = dotProp.get<unknown>(aggregation, formatter.findFrom);

          if (!typeAssert(strict, childValue)) {
            return aggregation;
          }

          const formatted = applyFormatters(childValue, formatter);
          return dotProp.set<object>(aggregation, formatter.findFrom, formatted);
        } catch {
          return aggregation;
        }
      }, eachValue);

      return formattersApplied;
    });

    return formattersAppliedArray;
  }

  // case 04. object of complex type
  if (typeof value === 'object' && value != null) {
    const formattersApplied = formatters
      .map((formatter) => {
        try {
          const childValue = dotProp.get<unknown>(value, formatter.findFrom);

          if (!typeAssert(strict, childValue)) {
            return {};
          }

          const formatted = applyFormatters(childValue, formatter);
          return dotProp.set({}, formatter.findFrom, formatted);
        } catch {
          return undefined;
        }
      })
      .filter((formatted) => formatted != null)
      .reduce<object>((aggregation, formatted) => recursive(aggregation, formatted) as object, { ...value });

    return formattersApplied;
  }

  typeAssert(strict, value);

  return value;
}
