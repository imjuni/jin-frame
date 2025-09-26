import type { IBodyFieldOption } from '#interfaces/field/body/IBodyFieldOption';
import { REQUEST_FIELD_DECORATOR } from '#decorators/fields/handlers/REQUEST_FIELD_DECORATOR';
import { getDefaultBodyFieldOption } from '#processors/default-option/getDefaultBodyFieldOption';
import 'reflect-metadata';

/**
 * decorator to set class variable to HTTP API body parameter
 * @param option body parameter option
 */
export function Body(_option?: Partial<Omit<IBodyFieldOption, 'type'>>) {
  return function bodyHandle(target: object, propertyKey: string | symbol): void {
    const option = getDefaultBodyFieldOption(_option);
    Reflect.defineMetadata(REQUEST_FIELD_DECORATOR, { key: propertyKey, option }, target, propertyKey);
  };
}
