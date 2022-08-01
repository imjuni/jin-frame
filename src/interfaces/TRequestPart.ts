import type { IBodyFieldOption } from '@interfaces/IBodyFieldOption';
import type { IHeaderFieldOption } from '@interfaces/IHeaderFieldOption';
import type { IParamFieldOption } from '@interfaces/IParamFieldOption';
import type { IQueryFieldOption } from '@interfaces/IQueryFieldOption';

export type TRequestPart =
  | IQueryFieldOption['type']
  | IParamFieldOption['type']
  | IBodyFieldOption['type']
  | IHeaderFieldOption['type'];
