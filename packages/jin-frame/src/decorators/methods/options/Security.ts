import { REQUEST_AUTHORIZATION_DECORATOR } from '#decorators/methods/handlers/REQUEST_AUTHORIZATION_DECORATOR';
import { REQUEST_SECURITY_DECORATOR } from '#decorators/methods/handlers/REQUEST_SECURITY_DECORATOR';
import type { FrameOption } from '#interfaces/options/FrameOption';
import type { SecurityKey } from '#interfaces/security/SecurityKey';
import 'reflect-metadata';

export function Security(_option: FrameOption['security'], key?: SecurityKey) {
  return function securityHandle(target: object): void {
    const prevSecurity =
      (Reflect.getOwnMetadata(REQUEST_SECURITY_DECORATOR, target) as FrameOption['security'][]) ?? [];

    Reflect.defineMetadata(REQUEST_SECURITY_DECORATOR, [...prevSecurity, _option], target);

    if (key != null) {
      const prevAuth =
        (Reflect.getOwnMetadata(REQUEST_AUTHORIZATION_DECORATOR, target) as FrameOption['authorization'][]) ?? [];
      Reflect.defineMetadata(REQUEST_AUTHORIZATION_DECORATOR, [...prevAuth, key], target);
    }
  };
}
