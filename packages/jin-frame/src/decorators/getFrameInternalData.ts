import type { FrameInternal } from '#interfaces/options/FrameInternal';
import type { FrameOption } from '#interfaces/options/FrameOption';

export function getFrameInternalData(option?: Partial<Omit<FrameOption, 'method'>>): FrameInternal {
  const frameData: FrameInternal = {
    startAt: new Date(),
    eachStartAt: new Date(),
    endAt: new Date(),
    query: {},
    header: {},
    param: {},
    body: undefined,
    retry: option?.retry != null ? { ...option.retry, try: 0 } : { max: 1, try: 0, interval: 0 },
  };

  return frameData;
}
