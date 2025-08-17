import { getFrameInternalData } from '#decorators/getFrameInternalData';
import { getFrameOption } from '#decorators/getFrameOption';
import type { IFrameOption } from '#tools/type-utilities/IFrameOption';
import type { Method } from 'axios';
import type { Constructor } from 'type-fest';
import 'reflect-metadata';
import { pushRequestMeta } from '#decorators/methods/handlers/pushRequestMeta';

export function makeRequestDecorator(method: Method) {
  return function decorate<T = unknown>(_option?: Partial<Omit<IFrameOption, 'method'>>) {
    return function decorateHandle(target: Constructor<T>): void {
      const option = Object.freeze(getFrameOption(method, _option));
      const data = Object.freeze(getFrameInternalData(option));
      pushRequestMeta<T>(target, Object.freeze({ option, data }));
    };
  };
}
