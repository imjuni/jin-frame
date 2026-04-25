import { REQUEST_RETRY_DECORATOR } from '#decorators/methods/handlers/REQUEST_RETRY_DECORATOR';
import type { FrameRetry } from '#interfaces/options/FrameRetry';
import 'reflect-metadata';

export function Retry(_option: FrameRetry) {
  return function retryHandle(target: object): void {
    const option = Object.freeze(_option);
    const prev = (Reflect.getOwnMetadata(REQUEST_RETRY_DECORATOR, target) as FrameRetry[] | undefined) ?? [];

    Reflect.defineMetadata(REQUEST_RETRY_DECORATOR, [...prev, option], target);
  };
}
