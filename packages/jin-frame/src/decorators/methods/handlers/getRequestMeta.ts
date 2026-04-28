import { getAllRequestMetaInherited } from '#decorators/methods/handlers/getAllMethodMetaInherited';
import type { AbstractConstructor, Constructor } from 'type-fest';
import type { FrameOption } from '#interfaces/options/FrameOption';
import type { MethodEntry } from '#interfaces/options/MethodEntry';
import type { FrameRetry } from '#interfaces/options/FrameRetry';
import { mergeFrameOption } from '#tools/mergeFrameOption';
import { mergeRetryOption } from '#tools/mergeRetryOption';

/**
 * Resolves and merges all method decorator metadata for a class constructor,
 * walking the inheritance chain. When a parent and child both apply a decorator,
 * the parent receives a higher index — child metadata takes precedence.
 *
 * @example
 * ```typescript
 * @Delete({ host: 'i-am-host' })
 * class ParentFrame {}
 *
 * @Get({ host: 'i-am-host' })
 * class ChildFrame extends ParentFrame {}
 * // ParentFrame → index 01, ChildFrame → index 00
 * ```
 *
 * @param ctor Constructor function
 */
export function getRequestMeta(ctor: AbstractConstructor<unknown> | Constructor<unknown>): MethodEntry {
  const metas = getAllRequestMetaInherited(ctor);

  // reverse meta data for recursive merge
  const methods = [...metas.methods].reverse();
  const retries = [...metas.retries].reverse();
  const timeouts = [...metas.timeouts].reverse();
  const validators = [...metas.validators].reverse();
  const dedupes = [...metas.dedupes].reverse();
  const authorizations = [...metas.authorizations].reverse();
  const securities = [...metas.securities].reverse();

  const mergedOption = methods.reduce<FrameOption>(
    (merged, meta) => mergeFrameOption(merged, meta.option),
    {} as FrameOption,
  );

  const mergedRetry = retries.reduce<FrameRetry | undefined>((merged, meta) => {
    if (merged == null) {
      return meta;
    }

    return mergeRetryOption(merged, meta);
  }, undefined);

  const mergedValidator = validators.at(-1);
  const mergedTimeout = timeouts.at(-1);
  const mergedDeduped = dedupes.at(-1);
  const mergedAuthorization = authorizations.at(-1);
  const mergedSecurity = securities.at(-1);

  if (mergedRetry != null) {
    mergedOption.retry = mergedRetry;
  }

  if (mergedTimeout != null) {
    mergedOption.timeout = mergedTimeout;
  }

  if (mergedValidator != null) {
    mergedOption.validators = mergedValidator;
  }

  if (mergedDeduped != null) {
    mergedOption.dedupe = mergedDeduped;
  }

  if (mergedAuthorization != null) {
    mergedOption.authorization = mergedAuthorization;
  }

  if (mergedSecurity != null) {
    mergedOption.security = mergedSecurity;
  }

  if (Object.keys(mergedOption).length <= 0) {
    throw new Error('You need to configure using method decorators such as Get, Post, Put, Delete, Patch, etc!');
  }

  return {
    option: mergedOption,
  };
}
