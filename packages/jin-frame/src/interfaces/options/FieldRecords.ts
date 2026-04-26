import type { BodyFieldOption } from '#interfaces/field/body/BodyFieldOption';
import type { HeaderFieldOption } from '#interfaces/field/HeaderFieldOption';
import type { ParamFieldOption } from '#interfaces/field/ParamFieldOption';
import type { QueryFieldOption } from '#interfaces/field/QueryFieldOption';

export type FieldRecords = Record<ParamFieldOption['type'], { key: string; option: ParamFieldOption }[]> &
  Record<QueryFieldOption['type'], { key: string; option: QueryFieldOption }[]> &
  Record<BodyFieldOption['type'], { key: string; option: BodyFieldOption }[]> &
  Record<HeaderFieldOption['type'], { key: string; option: HeaderFieldOption }[]>;
