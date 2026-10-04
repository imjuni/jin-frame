import type { BodyFieldOption } from "#interfaces/field/body/BodyFieldOption";
import type { ObjectBodyFieldOption } from "#interfaces/field/body/ObjectBodyFieldOption";
import type { CookieFieldOption } from "#interfaces/field/CookieFieldOption";
import type { HeaderFieldOption } from "#interfaces/field/HeaderFieldOption";
import type { ParamFieldOption } from "#interfaces/field/ParamFieldOption";
import type { QueryFieldOption } from "#interfaces/field/QueryFieldOption";

export type FieldEntry =
  | { key: string; option: QueryFieldOption }
  | { key: string; option: ParamFieldOption }
  | { key: string; option: BodyFieldOption }
  | { key: string; option: ObjectBodyFieldOption }
  | { key: string; option: HeaderFieldOption }
  | { key: string; option: CookieFieldOption };
