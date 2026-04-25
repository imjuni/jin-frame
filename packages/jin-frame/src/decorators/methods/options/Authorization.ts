import { REQUEST_AUTHORIZATION_DECORATOR } from '#decorators/methods/handlers/REQUEST_AUTHORIZATION_DECORATOR';
import type { FrameOption } from '#interfaces/options/FrameOption';
import 'reflect-metadata';

export function Authorization(_option: FrameOption['authorization']) {
  return function authorizationHandle(target: object): void {
    const prev =
      (Reflect.getOwnMetadata(REQUEST_AUTHORIZATION_DECORATOR, target) as FrameOption['authorization'][] | undefined) ??
      [];
    const option = Object.freeze(_option);

    Reflect.defineMetadata(REQUEST_AUTHORIZATION_DECORATOR, [...prev, option], target);
  };
}
