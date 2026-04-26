import type { ObjectBodyFieldOption } from '#interfaces/field/body/ObjectBodyFieldOption';
import { getDefaultObjectBodyFieldOption } from '#processors/default-option/getDefaultObjectBodyFieldOption';
import { REQUEST_FIELD_DECORATOR } from '#decorators/fields/handlers/REQUEST_FIELD_DECORATOR';
import 'reflect-metadata';

/**
 * decorator to set class variable to HTTP API body parameter
 * @param option body parameter option
 */
export function ObjectBody(_option?: Partial<Omit<ObjectBodyFieldOption, 'type'>>) {
  return function objectBodyHandle(target: object, propertyKey: string | symbol): void {
    const option = getDefaultObjectBodyFieldOption(_option);
    const existing: unknown[] = Reflect.getOwnMetadata(REQUEST_FIELD_DECORATOR, target, propertyKey) ?? [];
    Reflect.defineMetadata(REQUEST_FIELD_DECORATOR, [...existing, { key: propertyKey, option }], target, propertyKey);
  };
}
