import type { IObjectBodyFieldOption } from '#interfaces/body/IObjectBodyFieldOption';
import { getDefaultObjectBodyFieldOption } from '#processors/getDefaultOption';
import { REQUEST_FIELD_DECORATOR } from '#decorators/fields/handlers/REQUEST_FIELD_DECORATOR';
import 'reflect-metadata';

/**
 * decorator to set class variable to HTTP API body parameter
 * @param option body parameter option
 */
export function ObjectBody(_option?: Partial<Omit<IObjectBodyFieldOption, 'type'>>) {
  return function objectBodyHandle(target: object, propertyKey: string | symbol): void {
    const option = getDefaultObjectBodyFieldOption(_option);
    Reflect.defineMetadata(REQUEST_FIELD_DECORATOR, { key: propertyKey, option }, target, propertyKey);
  };
}
