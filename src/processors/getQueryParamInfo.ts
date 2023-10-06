import type { IParamFieldOption } from '#interfaces/IParamFieldOption';
import type { IQueryFieldOption } from '#interfaces/IQueryFieldOption';
import bitwised from '#tools/bitwised';
import encode from '#tools/encodes/encode';
import encodes from '#tools/encodes/encodes';
import applyFormatters from '#tools/formatters/applyFormatters';
import isValidArrayType from '#tools/type-narrowing/isValidArrayType';
import { isValidNumberArray } from '#tools/type-narrowing/isValidNumberArray';
import isValidPrimitiveType from '#tools/type-narrowing/isValidPrimitiveType';
import * as dotProp from 'dot-prop';

export function getQueryParamInfo<T extends Record<string, unknown>>(
  thisFrame: T,
  fields: { key: string; option: IQueryFieldOption | IParamFieldOption }[],
) {
  return fields.reduce<Record<string, unknown>>((resultObj, field) => {
    try {
      const { key: thisFrameAccessKey, option } = field;
      const value: unknown = dotProp.get<unknown>(thisFrame, thisFrameAccessKey);
      const fieldKey = option.replaceAt ?? thisFrameAccessKey;

      if (!isValidPrimitiveType(value) && !isValidArrayType(value)) {
        return { ...resultObj, [fieldKey]: value };
      }

      // stage 01. bit-wised operator processing
      if (option.bit.enable && Array.isArray(value) && isValidNumberArray(value)) {
        const bitwisedValue = bitwised(value);

        // include zero value in bit value
        if (option.bit.withZero === false && bitwisedValue === 0) {
          return resultObj;
        }

        // exclude zero value in bit value
        return { ...resultObj, [fieldKey]: encode(option.encode, bitwisedValue) };
      }

      const { formatter } = option;

      // stage 02. apply formatter
      if (formatter != null) {
        const formatted: string | string[] = applyFormatters(value, formatter);
        const commaApplied = Array.isArray(formatted) && option.comma ? formatted.join(',') : formatted;
        return {
          ...resultObj,
          [fieldKey]: Array.isArray(commaApplied)
            ? encodes(option.encode, commaApplied)
            : encode(option.encode, commaApplied),
        };
      }

      // stage 03. comma seperation processing
      const commaApplied = Array.isArray(value) && option.comma ? encode(option.encode, value.join(',')) : value;
      return { ...resultObj, [fieldKey]: commaApplied };
    } catch {
      return resultObj;
    }
  }, {});
}
