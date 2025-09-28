import type { TMethod } from '#interfaces/options/TMethod';
import type { IFrameOption } from '#interfaces/options/IFrameOption';

export function getFrameOption(method: TMethod, option?: Partial<Omit<IFrameOption, 'method'>>): IFrameOption {
  const frameOption: IFrameOption = {
    host: option?.host,
    pathPrefix: option?.pathPrefix,
    path: option?.path,
    method,
    customBody: option?.customBody,
    transformRequest: option?.transformRequest,
    useInstance: option?.useInstance ?? false,
    contentType: option?.contentType ?? 'application/json',
    userAgent: option?.userAgent,
    retry: option?.retry,
    timeout: option?.timeout,
    validator: option?.validator,
    dedupe: option?.dedupe,
    security: option?.security,
    authorization: option?.authorization,
  };

  return frameOption;
}
