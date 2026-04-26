import type { HeaderFieldOption } from '#interfaces/field/HeaderFieldOption';
import { REQUEST_FIELD_DECORATOR } from '#decorators/fields/handlers/REQUEST_FIELD_DECORATOR';
import { getDefaultHeaderFieldOption } from '#processors/default-option/getDefaultHeaderFieldOption';
import 'reflect-metadata';

/**
 * decorator to set class variable to HTTP API header parameter
 * @param option header parameter option
 */
export function Header(_option?: Partial<Omit<HeaderFieldOption, 'type'>>) {
  return function headerHandle(target: object, propertyKey: string | symbol): void {
    const option = getDefaultHeaderFieldOption(_option);
    const existing: unknown[] = Reflect.getOwnMetadata(REQUEST_FIELD_DECORATOR, target, propertyKey) ?? [];
    Reflect.defineMetadata(REQUEST_FIELD_DECORATOR, [...existing, { key: propertyKey, option }], target, propertyKey);
  };
}
