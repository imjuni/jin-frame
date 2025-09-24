import { REQUEST_FIELD_DECORATOR } from '#decorators/fields/handlers/REQUEST_FIELD_DECORATOR';
import type { IQueryFieldOption } from '#interfaces/field/IQueryFieldOption';
import type { IParamFieldOption } from '#interfaces/field/IParamFieldOption';
import type { IObjectBodyFieldOption } from '#interfaces/field/body/IObjectBodyFieldOption';
import type { IHeaderFieldOption } from '#interfaces/field/IHeaderFieldOption';
import type { IBodyFieldOption } from '#interfaces/field/body/IBodyFieldOption';
import 'reflect-metadata';

interface IRequestFieldRecord {
  param: IParamFieldOption[];
  query: IQueryFieldOption[];
  body: IBodyFieldOption[];
  objectBody: IObjectBodyFieldOption[];
  header: IHeaderFieldOption[];
}

export function getFieldMetadata(type: object, keys: { key: string; value: unknown }[]): IRequestFieldRecord {
  const fields = keys
    .map((key) => {
      const meta = Reflect.getOwnMetadata(REQUEST_FIELD_DECORATOR, type, key.key) as
        | { key: string; option: IQueryFieldOption }
        | { key: string; option: IParamFieldOption }
        | { key: string; option: IBodyFieldOption }
        | { key: string; option: IObjectBodyFieldOption }
        | { key: string; option: IHeaderFieldOption };
      return { key: key.key, meta };
    })
    .filter((field) => field.meta != null)
    .map((field) => ({ key: field.key, meta: { ...field.meta, option: { ...field.meta.option, key: field.key } } }));

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
    },
  );

  return fieldMap;
}
