import type { BodyFieldOption } from "#interfaces/field/body/BodyFieldOption";
import type { ObjectBodyFieldOption } from "#interfaces/field/body/ObjectBodyFieldOption";
import type { CookieFieldOption } from "#interfaces/field/CookieFieldOption";
import type { HeaderFieldOption } from "#interfaces/field/HeaderFieldOption";
import type { ParamFieldOption } from "#interfaces/field/ParamFieldOption";
import type { QueryFieldOption } from "#interfaces/field/QueryFieldOption";

export interface IRequestFieldRecord {
  param: ParamFieldOption[];
  query: QueryFieldOption[];
  body: BodyFieldOption[];
  objectBody: ObjectBodyFieldOption[];
  header: HeaderFieldOption[];
  cookie: CookieFieldOption[];
}
