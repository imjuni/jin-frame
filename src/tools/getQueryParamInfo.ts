import IParamFieldOption from '@interfaces/IParamFieldOption';
import IQueryFieldOption from '@interfaces/IQueryFieldOption';
import applyFormatter from '@tools/applyFormatter';
import bitwised from '@tools/bitwised';
import encode from '@tools/encode';
import { isFalse, isNotEmpty } from 'my-easy-fp';

export default function getQueryParamInfo<T extends Record<string, any>>(
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

      // stage 02. comma seperation processing
      if (option.comma && Array.isArray(value)) {
        const commaJoinValue = value.join(',');
        return { ...resultObj, [fieldKey]: encode(option.encode, commaJoinValue) };
      }

      const { formatter } = option;

      // stage 03. apply formatter
      if (isNotEmpty(formatter)) {
        const formatted = applyFormatter(value, formatter);
        return { ...resultObj, [fieldKey]: encode(option.encode, formatted) };
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