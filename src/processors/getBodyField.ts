import type { IBodyFieldOption } from '#interfaces/body/IBodyFieldOption';
import type { TSingleBodyFormatter } from '#interfaces/body/TSingleBodyFormatter';
import { classifyBodyFormatters } from '#tools/formatters/classifyBodyFormatters';
import { formatEach } from '#tools/formatters/formatEach';
import { getBodyFormatters } from '#tools/formatters/getBodyFormatters';
import { isValidArrayType } from '#tools/type-narrowing/isValidArrayType';
import { isValidPrimitiveWithDateType } from '#tools/type-narrowing/isValidPrimitiveWithDateType';
import type { TSupportArrayType } from '#tools/type-utilities/TSupportArrayType';
import type { TSupportPrimitiveType } from '#tools/type-utilities/TSupportPrimitiveType';
import * as dotProp from 'dot-prop';

export function getBodyField(thisFrame: unknown, field: { key: string; option: IBodyFieldOption }): unknown {
  if (
    isValidPrimitiveWithDateType(thisFrame) ||
    typeof thisFrame === 'bigint' ||
    typeof thisFrame === 'function' ||
    typeof thisFrame === 'symbol' ||
    (typeof thisFrame === 'object' && Array.isArray(thisFrame))
  ) {
    return thisFrame;
  }

  const { key: accessKey, option } = field;
  const value: unknown = (thisFrame as Record<string, unknown>)[accessKey];
  const formatters: TSingleBodyFormatter[] = getBodyFormatters(field.option.formatters);
  const replaceKey = option.replaceAt ?? accessKey;

  // case 02. nullable value
  if (value == null) {
    return thisFrame;
  }

  // case 02. primitive type & Date instance
  if (isValidPrimitiveWithDateType(value) && value instanceof Date && formatters.length <= 0) {
    const origin = {};
    dotProp.set(origin, replaceKey, value);

    return origin;
  }

  // case 03. array of primitive type & array of Date instance
  if (isValidPrimitiveWithDateType(value) || (Array.isArray(value) && isValidArrayType(value))) {
    const origin = {};
    dotProp.set(origin, replaceKey, value);

    const formatted = formatters.reduce<Record<string, TSupportPrimitiveType | TSupportArrayType>>(
      (processing, formatter) => {
        const childValue = dotProp.get<TSupportPrimitiveType | TSupportArrayType>(processing, replaceKey);
        const formatteds = formatEach(childValue, formatter);

        return dotProp.set(processing, replaceKey, formatteds);
      },
      origin,
    );

    return formatted;
  }

  // case 04. object of complex type
  const classifed = classifyBodyFormatters(formatters);
  const origin: Exclude<object, null | undefined> = {};

  dotProp.set(origin, replaceKey, value);

  const formatted = classifed.valid.reduce((processing, formatter) => {
    const childAccessKey = [accessKey, formatter.findFrom].join('.');
    const childReplaceKey = [replaceKey, formatter.findFrom].join('.');

    const childValue = dotProp.get<unknown>(processing, childAccessKey);
    const formatteds = formatEach(childValue, formatter);
    const next: Exclude<object, null | undefined> = { ...processing };

    dotProp.set(next, childReplaceKey, formatteds);

    return next;
  }, origin);

  return formatted;
}
