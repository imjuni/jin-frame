import { REQUEST_FIELD_DECORATOR } from '#decorators/fields/handlers/REQUEST_FIELD_DECORATOR';
import type { IQueryFieldOption } from '#interfaces/field/IQueryFieldOption';
import type { IParamFieldOption } from '#interfaces/field/IParamFieldOption';
import type { IObjectBodyFieldOption } from '#interfaces/field/body/IObjectBodyFieldOption';
import type { IHeaderFieldOption } from '#interfaces/field/IHeaderFieldOption';
import type { IBodyFieldOption } from '#interfaces/field/body/IBodyFieldOption';
import type { ICookieFieldOption } from '#interfaces/field/ICookieFieldOption';
import 'reflect-metadata';

interface IRequestFieldRecord {
  param: IParamFieldOption[];
  query: IQueryFieldOption[];
  body: IBodyFieldOption[];
  objectBody: IObjectBodyFieldOption[];
  header: IHeaderFieldOption[];
  cookie: ICookieFieldOption[];
}

type FieldEntry =
  | { key: string; option: IQueryFieldOption }
  | { key: string; option: IParamFieldOption }
  | { key: string; option: IBodyFieldOption }
  | { key: string; option: IObjectBodyFieldOption }
  | { key: string; option: IHeaderFieldOption }
  | { key: string; option: ICookieFieldOption };

export function getFieldMetadata(type: object, keys: { key: string; value: unknown }[]): IRequestFieldRecord {
  const fields: { key: string; meta: FieldEntry }[] = [];

  for (const key of keys) {
    const raw = Reflect.getOwnMetadata(REQUEST_FIELD_DECORATOR, type, key.key) as FieldEntry[] | undefined;

    if (raw != null) {
      for (const entry of raw) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
