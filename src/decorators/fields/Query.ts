import type { IQueryFieldOption } from '#interfaces/IQueryFieldOption';
import { getDefaultQueryFieldOption } from '#processors/getDefaultOption';
import { REQUEST_FIELD_DECORATOR } from '#decorators/fields/handlers/REQUEST_FIELD_DECORATOR';
import 'reflect-metadata';

/**
 * decorator to set class variable to HTTP API query parameter
 * @param option query parameter option
 */
export function Query(_option?: Partial<Omit<IQueryFieldOption, 'type'>>) {
  return function queryHandle(target: object, propertyKey: string | symbol): void {
    const option = getDefaultQueryFieldOption(_option);
    Reflect.defineMetadata(REQUEST_FIELD_DECORATOR, { key: propertyKey, option }, target, propertyKey);
  };
}
