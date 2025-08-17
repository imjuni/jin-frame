import type { IFrameInternal } from '#tools/type-utilities/IFrameInternal';
import type { IFrameOption } from '#tools/type-utilities/IFrameOption';
import axios from 'axios';

export function getFrameInternalData(option?: Partial<Omit<IFrameOption, 'method'>>): IFrameInternal {
  const frameData: IFrameInternal = {
    startAt: new Date(),
    endAt: new Date(),
    query: {},
    header: {},
    param: {},
    body: undefined,
    retry: option?.retry != null ? { ...option.retry, try: 0 } : option?.retry,
    instance: option?.useInstance ? axios.create() : axios,
  };

  return frameData;
}
