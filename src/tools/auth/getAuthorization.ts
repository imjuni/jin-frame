import type { IFrameOption } from '#interfaces/options/IFrameOption';
import type { AxiosRequestConfig } from 'axios';

export function getAuthorization(
  headers: Record<string, string>,
  authorization?: IFrameOption['authoriztion'],
  auth?: AxiosRequestConfig['auth'],
): { authKey?: string; auth?: AxiosRequestConfig['auth'] } {
  if (headers.Authorization != null) {
    return { authKey: headers.Authorization, auth: undefined };
  }

  if (auth != null) {
    return { authKey: undefined, auth };
  }

  if (authorization != null) {
    if (typeof authorization === 'string') {
      return { authKey: authorization, auth: undefined };
    }

    return { authKey: undefined, auth: authorization };
  }

  return { authKey: undefined, auth: undefined };
}
