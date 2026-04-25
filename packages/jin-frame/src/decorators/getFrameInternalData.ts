import type { JinHttpClient } from '#interfaces/JinHttpClient';
import type { IFrameInternal } from '#interfaces/options/IFrameInternal';
import type { IFrameOption } from '#interfaces/options/IFrameOption';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const placeholderClient: JinHttpClient = null as any;

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
    instance: placeholderClient,
  };

  return frameData;
}
