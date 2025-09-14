import type { IFrameInternal } from '#interfaces/options/IFrameInternal';
import type { IFrameOption } from '#interfaces/options/IFrameOption';
import axios from 'axios';

export function getFrameInternalData(option?: Partial<Omit<IFrameOption, 'method'>>): IFrameInternal {
  const frameData: IFrameInternal = {
    startAt: new Date(),
    eachStartAt: new Date(),
    endAt: new Date(),
    query: {},
    header: {},
    param: {},
    body: undefined,
    retry: option?.retry != null ? { ...option.retry, try: 0 } : { max: 1, try: 0, interval: 0 },
    instance: option?.useInstance ? axios.create() : axios,
  };

  return frameData;
}
