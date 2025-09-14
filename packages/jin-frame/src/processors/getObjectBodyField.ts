import type { TSingleBodyFormatter } from '#interfaces/field/body/TSingleBodyFormatter';
import type { IObjectBodyFieldOption } from '#interfaces/field/body/IObjectBodyFieldOption';
import { classifyBodyFormatters } from '#tools/formatters/classifyBodyFormatters';
import { getBodyFormatters } from '#tools/formatters/getBodyFormatters';
import { isValidArrayType } from '#tools/type-narrowing/isValidArrayType';
import { isValidPrimitiveWithDateType } from '#tools/type-narrowing/isValidPrimitiveWithDateType';
import type { TSupportPrimitiveType } from '#tools/type-utilities/TSupportPrimitiveType';
import { bodyFormatEach } from '#tools/formatters/bodyFormatEach';
import { formatEach } from '#tools/formatters/formatEach';

export function getObjectBodyField(
  thisFrame: unknown,
  field: { key: string; option: IObjectBodyFieldOption },
): unknown {
  if (
    isValidPrimitiveWithDateType(thisFrame) ||
    typeof thisFrame === 'bigint' ||
    typeof thisFrame === 'function' ||
    typeof thisFrame === 'symbol' ||
    (typeof thisFrame === 'object' && Array.isArray(thisFrame))
  ) {
    return thisFrame;
  }

  const { key: accessKey } = field;
  const value: unknown = (thisFrame as Record<string, unknown>)[accessKey];
  const formatters: TSingleBodyFormatter[] = getBodyFormatters(field.option.formatters);

  // case 02. nullable value
  if (value == null) {
    return thisFrame;
  }

  // case 02. primitive type & Date instance
  // case 03. array of primitive type & array of Date instance
  if (isValidPrimitiveWithDateType(value) || (Array.isArray(value) && isValidArrayType(value))) {
    const formatted = formatters.reduce<TSupportPrimitiveType | TSupportPrimitiveType[]>(
      (processing, formatter) => formatEach(processing, formatter),
      value,
    );

    return formatted;
  }

  // case 04. object of complex type
  const classifed = classifyBodyFormatters(formatters);
  const origin = value;

  const formatted = classifed.valid.reduce((processing, formatter) => {
    const formatteds = bodyFormatEach(processing, formatter) as object;
    return formatteds;
  }, origin);

  return formatted;
}
