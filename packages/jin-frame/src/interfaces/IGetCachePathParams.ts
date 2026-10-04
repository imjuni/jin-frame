import type { BodyFieldOption } from "#interfaces/field/body/BodyFieldOption";
import type { ObjectBodyFieldOption } from "#interfaces/field/body/ObjectBodyFieldOption";
import type { CookieFieldOption } from "#interfaces/field/CookieFieldOption";
import type { HeaderFieldOption } from "#interfaces/field/HeaderFieldOption";
import type { ParamFieldOption } from "#interfaces/field/ParamFieldOption";
import type { QueryFieldOption } from "#interfaces/field/QueryFieldOption";

export interface IGetCachePathParams {
  key: string;
  type:
    | QueryFieldOption["type"]
    | ParamFieldOption["type"]
    | HeaderFieldOption["type"]
    | BodyFieldOption["type"]
    | ObjectBodyFieldOption["type"]
    | CookieFieldOption["type"];
  replaceAt?: string;
}
