import { REQUEST_AUTHORIZATION_DECORATOR } from '#decorators/methods/handlers/REQUEST_AUTHORIZATION_DECORATOR';
import type { IFrameOption } from '#interfaces/options/IFrameOption';
import 'reflect-metadata';

export function Authorization(_option: IFrameOption['authorization']) {
  return function authorizationHandle(target: object): void {
    const prev =
      (Reflect.getOwnMetadata(REQUEST_AUTHORIZATION_DECORATOR, target) as
        | IFrameOption['authorization'][]
        | undefined) ?? [];
    const option = Object.freeze(_option);

    Reflect.defineMetadata(REQUEST_AUTHORIZATION_DECORATOR, [...prev, option], target);
  };
}
