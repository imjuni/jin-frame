import { REQUEST_FIELD_DECORATOR } from '#decorators/fields/handlers/REQUEST_FIELD_DECORATOR';
import type { QueryFieldOption } from '#interfaces/field/QueryFieldOption';
import type { ParamFieldOption } from '#interfaces/field/ParamFieldOption';
import type { ObjectBodyFieldOption } from '#interfaces/field/body/ObjectBodyFieldOption';
import type { HeaderFieldOption } from '#interfaces/field/HeaderFieldOption';
import type { BodyFieldOption } from '#interfaces/field/body/BodyFieldOption';
import type { CookieFieldOption } from '#interfaces/field/CookieFieldOption';
import 'reflect-metadata';

interface IRequestFieldRecord {
  param: ParamFieldOption[];
  query: QueryFieldOption[];
  body: BodyFieldOption[];
  objectBody: ObjectBodyFieldOption[];
  header: HeaderFieldOption[];
  cookie: CookieFieldOption[];
}

type FieldEntry =
  | { key: string; option: QueryFieldOption }
  | { key: string; option: ParamFieldOption }
  | { key: string; option: BodyFieldOption }
  | { key: string; option: ObjectBodyFieldOption }
  | { key: string; option: HeaderFieldOption }
  | { key: string; option: CookieFieldOption };

export function getFieldMetadata(type: object, keys: { key: string; value: unknown }[]): IRequestFieldRecord {
  const fields: { key: string; meta: FieldEntry }[] = [];

  for (const key of keys) {
    const raw = Reflect.getMetadata(REQUEST_FIELD_DECORATOR, type, key.key) as FieldEntry[] | undefined;

    if (raw != null) {
      for (const entry of raw) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fields.push({ key: key.key, meta: { key: key.key, option: { ...(entry.option as any), key: key.key } } });
      }
    }
  }

  const fieldMap = fields.reduce<IRequestFieldRecord>(
    (aggregate, field) => {
      const { option } = field.meta;

      switch (option.type) {
        case 'body':
          return { ...aggregate, body: [...aggregate.body, option] };
        case 'object-body':
          return { ...aggregate, objectBody: [...aggregate.objectBody, option] };
        case 'param':
          return { ...aggregate, param: [...aggregate.param, option] };
        case 'header':
          return { ...aggregate, header: [...aggregate.header, option] };
        case 'cookie':
          return { ...aggregate, cookie: [...aggregate.cookie, option] };
        default:
          return { ...aggregate, query: [...aggregate.query, option] };
      }
    },
    {
      param: [],
      body: [],
      objectBody: [],
      header: [],
      query: [],
      cookie: [],
    },
  );

  return fieldMap;
}
