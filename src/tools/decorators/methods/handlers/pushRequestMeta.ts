import { REQUEST_METHOD_DECORATOR } from '#tools/decorators/methods/handlers/REQUEST_METHOD_DECORATOR';
import type { TMethodEntry } from '#tools/decorators/methods/handlers/TMethodEntry';
import type { Constructor } from 'type-fest';
import 'reflect-metadata';

/**
 * target(생성자)에 메서드 엔트리를 누적(push) 저장
 *  */
export function pushRequestMeta<T>(target: Constructor<T>, entry: TMethodEntry): void {
  const prev = (Reflect.getOwnMetadata(REQUEST_METHOD_DECORATOR, target) as TMethodEntry[] | undefined) ?? [];
  Reflect.defineMetadata(REQUEST_METHOD_DECORATOR, [...prev, entry], target);
}
