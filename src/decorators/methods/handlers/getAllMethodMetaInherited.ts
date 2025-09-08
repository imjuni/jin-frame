import { REQUEST_METHOD_DECORATOR } from '#decorators/methods/handlers/REQUEST_METHOD_DECORATOR';
import type { TMethodEntry } from '#interfaces/options/TMethodEntry';
import type { AbstractConstructor, Constructor } from 'type-fest';
import type { Milliseconds } from 'axios';
import type { IFrameRetry } from '#interfaces/options/IFrameRetry';

import 'reflect-metadata';
import { REQUEST_RETRY_DECORATOR } from '#decorators/methods/handlers/REQUEST_RETRY_DECORATOR';
import { REQUEST_TIMEOUT_DECORATOR } from '#decorators/methods/handlers/REQUEST_TIMEOUT_DECORATOR';

export function getAllRequestMetaInherited(ctor: AbstractConstructor<unknown> | Constructor<unknown>): {
  methods: readonly TMethodEntry[];
  retries: readonly IFrameRetry[];
  timeouts: readonly Milliseconds[];
} {
  const methods: TMethodEntry[] = [];
  const retries: IFrameRetry[] = [];
  const timeouts: Milliseconds[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (
    let c: AbstractConstructor<unknown> | Constructor<unknown> = ctor;
    typeof c === 'function';
    c = Object.getPrototypeOf(c)
  ) {
    const method = (Reflect.getOwnMetadata(REQUEST_METHOD_DECORATOR, c) as TMethodEntry[] | undefined) ?? [];
    const retry = (Reflect.getOwnMetadata(REQUEST_RETRY_DECORATOR, c) as IFrameRetry[] | undefined) ?? [];
    const timeout = (Reflect.getOwnMetadata(REQUEST_TIMEOUT_DECORATOR, c) as Milliseconds[] | undefined) ?? [];

    methods.push(...method);
    retries.push(...retry);
    timeouts.push(...timeout);
  }

  return { methods, retries, timeouts };
}
