import { getAllRequestMetaInherited } from '#decorators/methods/handlers/getAllMethodMetaInherited';
import { recursive } from 'merge';
import type { AbstractConstructor, Constructor } from 'type-fest';
import type { IFrameInternal } from '#tools/type-utilities/IFrameInternal';
import type { IFrameOption } from '#tools/type-utilities/IFrameOption';
import type { TMethodEntry } from '#decorators/methods/handlers/TMethodEntry';

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
  const mergedOption: IFrameOption = {} as unknown as IFrameOption;
  const mergedData: IFrameInternal = {} as unknown as IFrameInternal;

  // reverse meta data for recursive merge
  const reversed = [...metas].reverse();

  recursive(mergedOption, ...reversed.map((meta) => meta.option));
  recursive(mergedData, ...reversed.map((meta) => meta.data));

  return {
    option: mergedOption,
    data: mergedData,
  };
}
