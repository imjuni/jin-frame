import { getAllRequestMetaInherited } from '#decorators/methods/handlers/getAllMethodMetaInherited';
import type { AbstractConstructor, Constructor } from 'type-fest';
import type { IFrameOption } from '#interfaces/options/IFrameOption';
import type { TMethodEntry } from '#interfaces/options/TMethodEntry';
import type { IFrameRetry } from '#interfaces/options/IFrameRetry';
import { mergeFrameOption } from '#tools/mergeFrameOption';
import { mergeRetryOption } from '#tools/mergeRetryOption';

/**
 *
 * 상속관계가 만들어지는 경우, 부모가 뒷번호 index를 받는다. 아래와 같은 경우
 * IamDecorateParentGetClass가 01, IamDecorateChildGetClass가 00 이다.
 *
 * @Delete({ host: 'i-am-host' })
 * class IamDecorateParentGetClass {}
 *
 * @Get({ host: 'i-am-host' })
 * class IamDecorateChildGetClass extends IamDecorateParentGetClass {}
 *
 * @param ctor Constructor function
 * @returns
 */
export function getRequestMeta(ctor: AbstractConstructor<unknown> | Constructor<unknown>): TMethodEntry {
  const metas = getAllRequestMetaInherited(ctor);

  // reverse meta data for recursive merge
  const methods = [...metas.methods].reverse();
  const retries = [...metas.retries].reverse();
  const timeouts = [...metas.timeouts].reverse();
  const validators = [...metas.validators].reverse();

  const mergedOption = methods.reduce<IFrameOption>(
    (merged, meta) => mergeFrameOption(merged, meta.option),
    {} as IFrameOption,
  );

  const mergedRetry = retries.reduce<IFrameRetry | undefined>((merged, meta) => {
    if (merged == null) {
      return meta;
    }

    return mergeRetryOption(merged, meta);
  }, undefined);

  const mergedValidator = validators.at(-1);

  const mergedTimeout = timeouts.at(-1);

  if (mergedRetry != null) {
    mergedOption.retry = mergedRetry;
  }

  if (mergedTimeout != null) {
    mergedOption.timeout = mergedTimeout;
  }

  if (mergedValidator != null) {
    mergedOption.validator = mergedValidator;
  }

  if (Object.keys(mergedOption).length <= 0) {
    throw new Error('You need to configure using method decorators such as Get, Post, Put, Delete, Patch, etc!');
  }

  return {
    option: mergedOption,
  };
}
