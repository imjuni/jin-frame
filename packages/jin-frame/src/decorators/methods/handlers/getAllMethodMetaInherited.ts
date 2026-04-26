import { REQUEST_METHOD_DECORATOR } from '#decorators/methods/handlers/REQUEST_METHOD_DECORATOR';
import { REQUEST_RETRY_DECORATOR } from '#decorators/methods/handlers/REQUEST_RETRY_DECORATOR';
import { REQUEST_TIMEOUT_DECORATOR } from '#decorators/methods/handlers/REQUEST_TIMEOUT_DECORATOR';
import { REQUEST_VALIDATOR_DECORATOR } from '#decorators/methods/handlers/REQUEST_VALIDATOR_DECORATOR';
import { REQUEST_DEDUPE_DECORATOR } from '#decorators/methods/handlers/REQUEST_DEDUPE_DECORATOR';
import { REQUEST_AUTHORIZATION_DECORATOR } from '#decorators/methods/handlers/REQUEST_AUTHORIZATION_DECORATOR';
import { REQUEST_SECURITY_DECORATOR } from '#decorators/methods/handlers/REQUEST_SECURITY_DECORATOR';
import type { MethodEntry } from '#interfaces/options/MethodEntry';
import type { AbstractConstructor, Constructor } from 'type-fest';
import type { FrameRetry } from '#interfaces/options/FrameRetry';
import type { BaseValidator } from '#validators/BaseValidator';
import type { Milliseconds } from '#interfaces/options/Milliseconds';
import type { FrameOption } from '#interfaces/options/FrameOption';
import 'reflect-metadata';

export function getAllRequestMetaInherited(ctor: AbstractConstructor<unknown> | Constructor<unknown>): {
  methods: readonly MethodEntry[];
  retries: readonly FrameRetry[];
  timeouts: readonly Milliseconds[];
  validators: readonly BaseValidator[];
  dedupes: readonly boolean[];
  authorizations: readonly FrameOption['authorization'][];
  securities: readonly FrameOption['security'][];
} {
  const methods: MethodEntry[] = [];
  const retries: FrameRetry[] = [];
  const timeouts: Milliseconds[] = [];
  const validators: BaseValidator[] = [];
  const dedupes: boolean[] = [];
  const authorizations: FrameOption['authorization'][] = [];
  const securities: FrameOption['security'][] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (
    let c: AbstractConstructor<unknown> | Constructor<unknown> = ctor;
    typeof c === 'function';
    c = Object.getPrototypeOf(c)
  ) {
    const method = (Reflect.getOwnMetadata(REQUEST_METHOD_DECORATOR, c) as MethodEntry[] | undefined) ?? [];
    const retry = (Reflect.getOwnMetadata(REQUEST_RETRY_DECORATOR, c) as FrameRetry[] | undefined) ?? [];
    const timeout = (Reflect.getOwnMetadata(REQUEST_TIMEOUT_DECORATOR, c) as Milliseconds[] | undefined) ?? [];
    const validator = (Reflect.getOwnMetadata(REQUEST_VALIDATOR_DECORATOR, c) as BaseValidator[] | undefined) ?? [];
    const dedupe = (Reflect.getOwnMetadata(REQUEST_DEDUPE_DECORATOR, c) as boolean[] | undefined) ?? [];
    const authorization =
      (Reflect.getOwnMetadata(REQUEST_AUTHORIZATION_DECORATOR, c) as FrameOption['authorization'][] | undefined) ?? [];
    const security =
      (Reflect.getOwnMetadata(REQUEST_SECURITY_DECORATOR, c) as FrameOption['security'][] | undefined) ?? [];

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
