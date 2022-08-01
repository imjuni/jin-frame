import type { IBodyFieldOption } from '@interfaces/IBodyFieldOption';
import type { IHeaderFieldOption } from '@interfaces/IHeaderFieldOption';
import { applyFormatter } from '@tools/applyFormatter';
import { mergeBody } from '@tools/mergeBody';
import { get, set } from 'dot-prop';
import { isError, isNotEmpty } from 'my-easy-fp';

export function getHeaderBodyInfo<T extends Record<string, any>>(
  origin: T,
  fields: Array<{ key: string; option: IBodyFieldOption | IHeaderFieldOption }>,
) {
  const sorted = fields.sort((l, r) => (l.option?.order ?? 0) - (r.option?.order ?? 0));
  return sorted.reduce<Record<string, any>>((resultObj, field) => {
    try {
      const { key: fieldKey, option } = field;
      const value: any = origin[fieldKey];

      const { formatters } = option;

      if (isNotEmpty(formatters)) {
        const formattedObj = formatters.reduce<Record<string, any>>(
          (nextBodyObjProcessing, formatter) => {
            const formatted = applyFormatter(get<any>(value, formatter.key), formatter);
            set(nextBodyObjProcessing, formatter.key, formatted);
            return nextBodyObjProcessing;
          },
          { ...value },
        );

        if (isNotEmpty(option.key)) {
          const next = { ...resultObj };
          const merged = mergeBody(next[option.key], formattedObj);
          set(next, option.key, merged);
          return next;
        }

        const next = { ...resultObj };
        const merged = mergeBody(next[fieldKey], formattedObj);
        set(next, fieldKey, merged);
        return next;
      }

      if (isNotEmpty(value) && isNotEmpty(option.key)) {
        return { ...resultObj, [option.key]: mergeBody(resultObj[option.key], value) };
      }

      if (isNotEmpty(value)) {
        return { ...resultObj, [fieldKey]: mergeBody(resultObj[fieldKey], value) };
      }

      return resultObj;
    } catch (catched) {
      const err = isError(catched) ?? new Error('unknown error raised body');
      throw err;
    }
  }, {});
}
