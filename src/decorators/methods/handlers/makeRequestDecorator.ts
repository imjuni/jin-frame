import { getFrameOption } from '#decorators/getFrameOption';
import type { IFrameOption } from '#interfaces/options/IFrameOption';
import type { Constructor } from 'type-fest';
import { pushRequestMeta } from '#decorators/methods/handlers/pushRequestMeta';
import type { TMethod } from '#interfaces/options/TMethod';

import 'reflect-metadata';

export function makeRequestDecorator(method: TMethod) {
  return function decorate<T = unknown>(_option?: Partial<Omit<IFrameOption, 'method'>>) {
    return function decorateHandle(target: Constructor<T>): void {
      const option = Object.freeze(getFrameOption(method, _option));
      pushRequestMeta<T>(target, Object.freeze({ option }));
    };
  };
}
