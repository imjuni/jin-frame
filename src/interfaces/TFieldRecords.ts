import type { IBodyFieldOption } from '#interfaces/body/IBodyFieldOption';
import type { IHeaderFieldOption } from '#interfaces/IHeaderFieldOption';
import type { IParamFieldOption } from '#interfaces/IParamFieldOption';
import type { IQueryFieldOption } from '#interfaces/IQueryFieldOption';

export type TFieldRecords = Record<IParamFieldOption['type'], { key: string; option: IParamFieldOption }[]> &
  Record<IQueryFieldOption['type'], { key: string; option: IQueryFieldOption }[]> &
  Record<IBodyFieldOption['type'], { key: string; option: IBodyFieldOption }[]> &
  Record<IHeaderFieldOption['type'], { key: string; option: IHeaderFieldOption }[]>;
