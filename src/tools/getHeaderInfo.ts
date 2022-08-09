import { IFormatter } from '@interfaces/IFormatter';
import { THeaderFieldOption } from '@interfaces/IHeaderFieldOption';
import { applyFormatters } from '@tools/applyFormatters';
import { encode, encodes } from '@tools/encode';
import { mergeBody } from '@tools/mergeBody';
import { isError, isNotEmpty } from 'my-easy-fp';

type THeaderFieldType = string | number | boolean | Date | string[] | number[] | boolean[] | Date[];

interface IHeaderField {
  key: string;
  option: THeaderFieldOption;
}

// case key with formatter
function processFormatter<T extends Record<string, THeaderFieldType>>(
  thisFrame: T,
  field: IHeaderField,
  key: string | undefined,
  formatter: IFormatter,
) {
  const { key: thisFrameAccessKey, option } = field;
  const value: any = thisFrame[thisFrameAccessKey];
  const targetObjectPropsKey = key ?? thisFrameAccessKey;
  const formatted = applyFormatters(value, formatter);
  const encoded = encode(option.encode, formatted);

  return { [targetObjectPropsKey]: encoded };
}

function processFormatters<T extends Record<string, any>>(
  thisFrame: T,
  field: IHeaderField,
  formatters: Array<{ key: string } & IFormatter>,
) {
  const { key: thisFrameAccessKey, option } = field;
  const value: any = thisFrame[thisFrameAccessKey];

  const formatteds = formatters.map<Record<string, any>>((formatter) => {
    const formatted = applyFormatters(value[formatter.key], formatter);
    const encoded = encodes(option.encode, formatted);
    return { [formatter.key]: encoded };
  });

  const mergedObj = formatteds.reduce((merged, formatted) => {
    return { ...merged, ...formatted };
  }, {});

  return mergedObj;
}

export function getHeaderInfo<T extends Record<string, any>>(thisFrame: T, fields: IHeaderField[]) {
  // const sorted = fields.sort((l, r) => (l.option?.order ?? 0) - (r.option?.order ?? 0));

  return fields.reduce<Record<string, any>>((bodyObj, field) => {
    try {
      const { key: thisFrameAccessKey, option } = field;
      const value: any = thisFrame[thisFrameAccessKey];

      if ('formatter' in option && option.formatter !== undefined && option.formatter !== null) {
        const obj = processFormatter(thisFrame, field, option.key ?? thisFrameAccessKey, option.formatter);
        const next = mergeBody(bodyObj, obj);
        return next;
      }

      if (
        'formatters' in option &&
        option.formatters !== undefined &&
        option.formatters !== null &&
        option.formatters.length > 0
      ) {
        const obj = processFormatters(thisFrame, field, option.formatters);
        const next = { ...bodyObj, ...obj };
        return next;
      }

      if (isNotEmpty(value)) {
        return { ...bodyObj, [thisFrameAccessKey]: mergeBody(bodyObj[thisFrameAccessKey], value) };
      }

      return bodyObj;
    } catch (catched) {
      const err = isError(catched) ?? new Error('unknown error raised body');
      throw err;
    }
  }, {});
}
