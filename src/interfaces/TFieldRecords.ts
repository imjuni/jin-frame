import type { IBodyFieldOption } from '#interfaces/body/IBodyFieldOption';
import type { IHeaderFieldOption } from '#interfaces/IHeaderFieldOption';
import type { IParamFieldOption } from '#interfaces/IParamFieldOption';
import type { IQueryFieldOption } from '#interfaces/IQueryFieldOption';

export type TFieldRecords = Record<IParamFieldOption['type'], Array<{ key: string; option: IParamFieldOption }>> &
  Record<IQueryFieldOption['type'], Array<{ key: string; option: IQueryFieldOption }>> &
  Record<IBodyFieldOption['type'], Array<{ key: string; option: IBodyFieldOption }>> &
  Record<IHeaderFieldOption['type'], Array<{ key: string; option: IHeaderFieldOption }>>;
