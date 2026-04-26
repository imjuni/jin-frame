import type { BodyFieldOption } from '#interfaces/field/body/BodyFieldOption';
import type { SingleBodyFormatter } from '#interfaces/field/body/SingleBodyFormatter';
import { classifyBodyFormatters } from '#tools/formatters/classifyBodyFormatters';
import { formatEach } from '#tools/formatters/formatEach';
import { getBodyFormatters } from '#tools/formatters/getBodyFormatters';
import { isValidArrayType } from '#tools/type-narrowing/isValidArrayType';
import { isValidPrimitiveWithDateType } from '#tools/type-narrowing/isValidPrimitiveWithDateType';
import type { SupportArrayType } from '#tools/type-utilities/SupportArrayType';
import type { SupportPrimitiveType } from '#tools/type-utilities/SupportPrimitiveType';
import * as dotProp from 'dot-prop';

export function getBodyField(thisFrame: unknown, field: BodyFieldOption): unknown {
  if (
    isValidPrimitiveWithDateType(thisFrame) ||
    typeof thisFrame === 'bigint' ||
    typeof thisFrame === 'function' ||
    typeof thisFrame === 'symbol' ||
    (typeof thisFrame === 'object' && Array.isArray(thisFrame))
  ) {
    return thisFrame;
  }

  const accessKey = field.key;
  const value: unknown = (thisFrame as Record<string, unknown>)[accessKey];
  const formatters: SingleBodyFormatter[] = getBodyFormatters(field.formatters);
  const replaceKey = field.replaceAt ?? accessKey;

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

    const formatted = formatters.reduce<Record<string, SupportPrimitiveType | SupportArrayType>>(
      (processing, formatter) => {
        const childValue = dotProp.get<SupportPrimitiveType | SupportArrayType>(processing, replaceKey);
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
