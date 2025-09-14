import { REQUEST_FIELD_DECORATOR } from '#decorators/fields/handlers/REQUEST_FIELD_DECORATOR';
import type { IQueryFieldOption } from '#interfaces/field/IQueryFieldOption';
import type { IParamFieldOption } from '#interfaces/field/IParamFieldOption';
import type { IObjectBodyFieldOption } from '#interfaces/field/body/IObjectBodyFieldOption';
import type { IHeaderFieldOption } from '#interfaces/field/IHeaderFieldOption';
import type { IBodyFieldOption } from '#interfaces/field/body/IBodyFieldOption';
import 'reflect-metadata';

interface IRequestFieldRecord {
  param: { key: string; option: IParamFieldOption }[];
  query: { key: string; option: IQueryFieldOption }[];
  body: { key: string; option: IBodyFieldOption }[];
  objectBody: { key: string; option: IObjectBodyFieldOption }[];
  header: { key: string; option: IHeaderFieldOption }[];
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
    .filter((field) => field.meta != null);

  const fieldMap = fields.reduce<IRequestFieldRecord>(
    (aggregate, field) => {
      const { option } = field.meta;

      if (option.type === 'body') {
        return { ...aggregate, body: [...aggregate.body, { key: field.key, option }] };
      }

      if (option.type === 'object-body') {
        return { ...aggregate, objectBody: [...aggregate.objectBody, { key: field.key, option }] };
      }

      if (option.type === 'param') {
        return { ...aggregate, param: [...aggregate.param, { key: field.key, option }] };
      }

      if (option.type === 'header') {
        return { ...aggregate, header: [...aggregate.header, { key: field.key, option }] };
      }

      return { ...aggregate, query: [...aggregate.query, { key: field.key, option }] };
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
