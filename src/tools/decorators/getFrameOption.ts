import type { IFrameInternal } from '#tools/type-utilities/IFrameInternal';
import type { IFrameOption } from '#tools/type-utilities/IFrameOption';
import type { Method } from 'axios';
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

export function getFrameOption(method: Method, option?: Partial<Omit<IFrameOption, 'method'>>): IFrameOption {
  const frameOption: IFrameOption = {
    host: option?.host,
    path: option?.path,
    method,
    customBody: option?.customBody,
    transformRequest: option?.transformRequest,
    useInstance: option?.useInstance ?? false,
    contentType: option?.contentType ?? 'application/json',
    userAgent: option?.userAgent,
    retry: option?.retry,
    timeout: option?.timeout,
  };

  return frameOption;
}
