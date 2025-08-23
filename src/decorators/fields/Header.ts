import type { IHeaderFieldOption } from '#interfaces/field/IHeaderFieldOption';
import { getDefaultHeaderFieldOption } from '#processors/getDefaultOption';
import { REQUEST_FIELD_DECORATOR } from '#decorators/fields/handlers/REQUEST_FIELD_DECORATOR';
import 'reflect-metadata';

/**
 * decorator to set class variable to HTTP API header parameter
 * @param option header parameter option
 */
export function Header(_option?: Partial<Omit<IHeaderFieldOption, 'type'>>) {
  return function headerHandle(target: object, propertyKey: string | symbol): void {
    const option = getDefaultHeaderFieldOption(_option);
    Reflect.defineMetadata(REQUEST_FIELD_DECORATOR, { key: propertyKey, option }, target, propertyKey);
  };
}
