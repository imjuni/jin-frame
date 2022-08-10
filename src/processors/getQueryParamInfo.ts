import type { IParamFieldOption } from '@interfaces/IParamFieldOption';
import type { IQueryFieldOption } from '@interfaces/IQueryFieldOption';
import { applyFormatters } from '@tools/applyFormatters';
import { bitwised } from '@tools/bitwised';
import { encode } from '@tools/encode';
import { isValidArrayType } from '@tools/typeAssert';
import { isFalse, isNotEmpty } from 'my-easy-fp';

export function getQueryParamInfo<T extends Record<string, any>>(
  origin: T,
  fields: Array<{ key: string; option: IQueryFieldOption | IParamFieldOption }>,
) {
  return fields.reduce<Record<string, any>>((resultObj, field) => {
    try {
      const { key: fieldKey, option } = field;
      const value = origin[fieldKey];

      // stage 01. bit-wised operator processing
      if (
        isNotEmpty(option.bit) &&
        option.bit.enable &&
        Array.isArray(value) &&
        value.every((num) => typeof num === 'number')
      ) {
        const bitwisedValue = bitwised(value);

        // include zero value in bit value
        if (isFalse(option.bit.withZero) && bitwisedValue === 0) {
          return resultObj;
        }

        // exclude zero value in bit value
        return { ...resultObj, [fieldKey]: encode(option.encode, bitwisedValue) };
      }

      const { formatter } = option;

      // stage 02. apply formatter
      if (isNotEmpty(formatter)) {
        const formatted: string | string[] = applyFormatters(value, formatter);
        const commaApplied = isValidArrayType(formatted) && option.comma ? formatted.join(',') : formatted;
        return { ...resultObj, [fieldKey]: encode(option.encode, commaApplied) };
      }

      // stage 03. comma seperation processing
      if (Array.isArray(value)) {
        const commaApplied = option.comma ? encode(option.encode, value.join(',')) : value;
        return { ...resultObj, [fieldKey]: commaApplied };
      }

      if (isNotEmpty(value)) {
        return { ...resultObj, [fieldKey]: origin[fieldKey] };
      }

      return resultObj;
    } catch {
      return resultObj;
    }
  }, {});
}