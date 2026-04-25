import { REQUEST_SECURITY_DECORATOR } from '#decorators/methods/handlers/REQUEST_SECURITY_DECORATOR';
import type { FrameOption } from '#interfaces/options/FrameOption';
import 'reflect-metadata';

export function Security(_option: FrameOption['security']) {
  return function securityHandle(target: object): void {
    const prev = (Reflect.getOwnMetadata(REQUEST_SECURITY_DECORATOR, target) as FrameOption['security'][]) ?? [];
    const option = Object.freeze(_option);

    Reflect.defineMetadata(REQUEST_SECURITY_DECORATOR, [...prev, option], target);
  };
}
