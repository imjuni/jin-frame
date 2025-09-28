import { REQUEST_METHOD_DECORATOR } from '#decorators/methods/handlers/REQUEST_METHOD_DECORATOR';
import { REQUEST_RETRY_DECORATOR } from '#decorators/methods/handlers/REQUEST_RETRY_DECORATOR';
import { REQUEST_TIMEOUT_DECORATOR } from '#decorators/methods/handlers/REQUEST_TIMEOUT_DECORATOR';
import { REQUEST_VALIDATOR_DECORATOR } from '#decorators/methods/handlers/REQUEST_VALIDATOR_DECORATOR';
import { REQUEST_DEDUPE_DECORATOR } from '#decorators/methods/handlers/REQUEST_DEDUPE_DECORATOR';
import { REQUEST_AUTHORIZATION_DECORATOR } from '#decorators/methods/handlers/REQUEST_AUTHORIZATION_DECORATOR';
import { REQUEST_SECURITY_DECORATOR } from '#decorators/methods/handlers/REQUEST_SECURITY_DECORATOR';
import type { TMethodEntry } from '#interfaces/options/TMethodEntry';
import type { AbstractConstructor, Constructor } from 'type-fest';
import type { IFrameRetry } from '#interfaces/options/IFrameRetry';
import type { BaseValidator } from '#validators/BaseValidator';
import type { TMilliseconds } from '#interfaces/options/TMilliseconds';
import type { IFrameOption } from '#interfaces/options/IFrameOption';
import 'reflect-metadata';

export function getAllRequestMetaInherited(ctor: AbstractConstructor<unknown> | Constructor<unknown>): {
  methods: readonly TMethodEntry[];
  retries: readonly IFrameRetry[];
  timeouts: readonly TMilliseconds[];
  validators: readonly BaseValidator[];
  dedupes: readonly boolean[];
  authorizations: readonly IFrameOption['authorization'][];
  securities: readonly IFrameOption['security'][];
} {
  const methods: TMethodEntry[] = [];
  const retries: IFrameRetry[] = [];
  const timeouts: TMilliseconds[] = [];
  const validators: BaseValidator[] = [];
  const dedupes: boolean[] = [];
  const authorizations: IFrameOption['authorization'][] = [];
  const securities: IFrameOption['security'][] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (
    let c: AbstractConstructor<unknown> | Constructor<unknown> = ctor;
    typeof c === 'function';
    c = Object.getPrototypeOf(c)
  ) {
    const method = (Reflect.getOwnMetadata(REQUEST_METHOD_DECORATOR, c) as TMethodEntry[] | undefined) ?? [];
    const retry = (Reflect.getOwnMetadata(REQUEST_RETRY_DECORATOR, c) as IFrameRetry[] | undefined) ?? [];
    const timeout = (Reflect.getOwnMetadata(REQUEST_TIMEOUT_DECORATOR, c) as TMilliseconds[] | undefined) ?? [];
    const validator = (Reflect.getOwnMetadata(REQUEST_VALIDATOR_DECORATOR, c) as BaseValidator[] | undefined) ?? [];
    const dedupe = (Reflect.getOwnMetadata(REQUEST_DEDUPE_DECORATOR, c) as boolean[] | undefined) ?? [];
    const authorization =
      (Reflect.getOwnMetadata(REQUEST_AUTHORIZATION_DECORATOR, c) as IFrameOption['authorization'][] | undefined) ?? [];
    const security =
      (Reflect.getOwnMetadata(REQUEST_SECURITY_DECORATOR, c) as IFrameOption['security'][] | undefined) ?? [];

    methods.push(...method);
    retries.push(...retry);
    timeouts.push(...timeout);
    validators.push(...validator);
    dedupes.push(...dedupe);
    authorizations.push(...authorization);
    securities.push(...security);
  }

  return { methods, retries, timeouts, validators, dedupes, authorizations, securities };
}
