import type { ICookieFieldOption } from '#interfaces/field/ICookieFieldOption';
import { REQUEST_FIELD_DECORATOR } from '#decorators/fields/handlers/REQUEST_FIELD_DECORATOR';
import { getDefaultCookieFieldOption } from '#processors/default-option/getDefaultCookieFieldOption';
import 'reflect-metadata';

/**
 * decorator to set class variable to HTTP Cookie header
 * @param option cookie field option
 */
export function Cookie(_option?: Partial<Omit<ICookieFieldOption, 'type'>>) {
  return function cookieHandle(target: object, propertyKey: string | symbol): void {
    const option = getDefaultCookieFieldOption(_option);
    const existing: unknown[] = Reflect.getOwnMetadata(REQUEST_FIELD_DECORATOR, target, propertyKey) ?? [];
    Reflect.defineMetadata(REQUEST_FIELD_DECORATOR, [...existing, { key: propertyKey, option }], target, propertyKey);
  };
}
