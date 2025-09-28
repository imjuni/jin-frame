import { REQUEST_SECURITY_DECORATOR } from '#decorators/methods/handlers/REQUEST_SECURITY_DECORATOR';
import type { IFrameOption } from '#interfaces/options/IFrameOption';
import 'reflect-metadata';

export function Security(_option: IFrameOption['security']) {
  return function securityHandle(target: object): void {
    const prev = (Reflect.getOwnMetadata(REQUEST_SECURITY_DECORATOR, target) as IFrameOption['security'][]) ?? [];
    const option = Object.freeze(_option);

    Reflect.defineMetadata(REQUEST_SECURITY_DECORATOR, [...prev, option], target);
  };
}
