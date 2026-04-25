import type { TMethod } from '#interfaces/options/TMethod';
import type { FrameOption } from '#interfaces/options/FrameOption';

export function getFrameOption(method: TMethod, option?: Partial<Omit<FrameOption, 'method'>>): FrameOption {
  const frameOption: FrameOption = {
    host: option?.host,
    pathPrefix: option?.pathPrefix,
    path: option?.path,
    method,
    customBody: option?.customBody,
    contentType: option?.contentType ?? 'application/json',
    userAgent: option?.userAgent,
    retry: option?.retry,
    timeout: option?.timeout,
    validator: option?.validator,
    dedupe: option?.dedupe,
    security: option?.security,
    authorization: option?.authorization,
    authoriztion: option?.authoriztion,
  };

  return frameOption;
}
