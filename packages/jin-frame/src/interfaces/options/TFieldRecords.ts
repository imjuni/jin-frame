import type { IBodyFieldOption } from '#interfaces/field/body/IBodyFieldOption';
import type { IHeaderFieldOption } from '#interfaces/field/IHeaderFieldOption';
import type { IParamFieldOption } from '#interfaces/field/IParamFieldOption';
import type { IQueryFieldOption } from '#interfaces/field/IQueryFieldOption';

export type TFieldRecords = Record<IParamFieldOption['type'], { key: string; option: IParamFieldOption }[]> &
  Record<IQueryFieldOption['type'], { key: string; option: IQueryFieldOption }[]> &
  Record<IBodyFieldOption['type'], { key: string; option: IBodyFieldOption }[]> &
  Record<IHeaderFieldOption['type'], { key: string; option: IHeaderFieldOption }[]>;
