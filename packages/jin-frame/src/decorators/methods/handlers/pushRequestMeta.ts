import { REQUEST_METHOD_DECORATOR } from '#decorators/methods/handlers/REQUEST_METHOD_DECORATOR';
import type { MethodEntry } from '#interfaces/options/MethodEntry';
import type { Constructor } from 'type-fest';
import 'reflect-metadata';

/** Appends a method entry to the metadata stored on the given constructor target. */
export function pushRequestMeta<T>(target: Constructor<T>, entry: MethodEntry): void {
  const prev = (Reflect.getOwnMetadata(REQUEST_METHOD_DECORATOR, target) as MethodEntry[] | undefined) ?? [];
  Reflect.defineMetadata(REQUEST_METHOD_DECORATOR, [...prev, entry], target);
}
