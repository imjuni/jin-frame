import { REQUEST_TIMEOUT_DECORATOR } from '#decorators/methods/handlers/REQUEST_TIMEOUT_DECORATOR';
import type { Milliseconds } from '#interfaces/options/Milliseconds';
import 'reflect-metadata';

export function Timeout(_option: Milliseconds) {
  return function timeotuHandle(target: object): void {
    const prev = (Reflect.getOwnMetadata(REQUEST_TIMEOUT_DECORATOR, target) as Milliseconds[] | undefined) ?? [];
    const option = Object.freeze(_option);

    Reflect.defineMetadata(REQUEST_TIMEOUT_DECORATOR, [...prev, option], target);
  };
}
