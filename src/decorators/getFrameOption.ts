import type { IFrameOption } from '#tools/type-utilities/IFrameOption';
import type { Method } from 'axios';

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
    authoriztion: option?.authoriztion,
  };

  return frameOption;
}
