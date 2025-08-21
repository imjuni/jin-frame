import { getAllRequestMetaInherited } from '#decorators/methods/handlers/getAllMethodMetaInherited';
import type { AbstractConstructor, Constructor } from 'type-fest';
import type { IFrameOption } from '#tools/type-utilities/IFrameOption';
import type { TMethodEntry } from '#interfaces/TMethodEntry';
import { mergeFrameOption } from '#tools/mergeOption';

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
  const reversed = [...metas].reverse();

  const mergedOption = reversed.reduce<IFrameOption>(
    (merged, meta) => mergeFrameOption(merged, meta.option),
    {} as IFrameOption,
  );

  if (Object.keys(mergedOption).length <= 0) {
    throw new Error('You need to configure using method decorators such as Get, Post, Put, Delete, Patch, etc!');
  }

  return {
    option: mergedOption,
  };
}
