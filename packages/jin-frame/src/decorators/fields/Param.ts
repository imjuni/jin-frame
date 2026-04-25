import type { IParamFieldOption } from '#interfaces/field/IParamFieldOption';
import { getDefaultParamFieldOption } from '#processors/default-option/getDefaultParamFieldOption';
import { REQUEST_FIELD_DECORATOR } from '#decorators/fields/handlers/REQUEST_FIELD_DECORATOR';
import 'reflect-metadata';

/**
 * decorator to set class variable to HTTP API path parameter
 * @param option path parameter option
 */
export function Param(_option?: Partial<Omit<IParamFieldOption, 'type'>>) {
  return function paramHandle(target: object, propertyKey: string | symbol): void {
    const option = getDefaultParamFieldOption(_option);
    const existing: unknown[] = Reflect.getOwnMetadata(REQUEST_FIELD_DECORATOR, target, propertyKey) ?? [];
    Reflect.defineMetadata(REQUEST_FIELD_DECORATOR, [...existing, { key: propertyKey, option }], target, propertyKey);
  };
}
