import type { IHeaderFieldOption } from '#interfaces/field/IHeaderFieldOption';
import type { IParamFieldOption } from '#interfaces/field/IParamFieldOption';
import type { IQueryFieldOption } from '#interfaces/field/IQueryFieldOption';

export function getQuerystringKeyFormat(
  option?: IQueryFieldOption | IParamFieldOption | IHeaderFieldOption,
): IQueryFieldOption['keyFormat'] {
  if (option == null) {
    return undefined;
  }

  if (option.type === 'query') {
    return option.keyFormat;
  }

  return undefined;
}
