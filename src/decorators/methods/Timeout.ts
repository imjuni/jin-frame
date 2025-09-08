import { REQUEST_TIMEOUT_DECORATOR } from '#decorators/methods/handlers/REQUEST_TIMEOUT_DECORATOR';
import type { TMilliseconds } from '#interfaces/options/TMilliseconds';
import 'reflect-metadata';

/**
 */
export function Timeout(_option: TMilliseconds) {
  return function timeotuHandle(target: object): void {
    const prev = (Reflect.getOwnMetadata(REQUEST_TIMEOUT_DECORATOR, target) as TMilliseconds[] | undefined) ?? [];
    const option = Object.freeze(_option);

    Reflect.defineMetadata(REQUEST_TIMEOUT_DECORATOR, [...prev, option], target);
  };
}
