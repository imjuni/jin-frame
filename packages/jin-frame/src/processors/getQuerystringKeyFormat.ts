import type { HeaderFieldOption } from '#interfaces/field/HeaderFieldOption';
import type { ParamFieldOption } from '#interfaces/field/ParamFieldOption';
import type { QueryFieldOption } from '#interfaces/field/QueryFieldOption';

export function getQuerystringKeyFormat(
  option?: QueryFieldOption | ParamFieldOption | HeaderFieldOption,
): QueryFieldOption['keyFormat'] {
  if (option == null) {
    return undefined;
  }

  if (option.type === 'query') {
    return option.keyFormat;
  }

  return undefined;
}
