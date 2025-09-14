import type { IFrameRetry } from '#interfaces/options/IFrameRetry';
import type { TMethod } from '#interfaces/options/TMethod';
import type { AxiosRequestConfig, Milliseconds } from 'axios';

export interface IFrameOption {
  /**
   * host and path of API Request endpoint
   *
   * 원한다면 protocol://host/path 전체를 host에 전달해도 정상 동작한다. 그럼에도 불구하고
   * 굳이 host와 path를 분리한 이유는 Parent Class에 host를 설정하고 그것을 계속 상속을 받아서
   * 사용하는 방식으로 확장하는 경우, Child Class에서는 path만 설정할 수 있어야 하기 때문에
   * 둘을 분리해서 처리할 수도 있어야 한다.
   * */
  host?: string;

  /** path of API Request endpoint */
  path?: string;

  /** method of API Request endpoint */
  method: TMethod;

  /** content-type of API Request endpoint */
  contentType: string;

  /** user agent of API Request endpoint */
  userAgent?: string;

  /** custom object of POST Request body data */
  customBody?: unknown;

  /** transformRequest function of POST Request */
  transformRequest?: AxiosRequestConfig['transformRequest'];

  /** retry configuration */
  retry?: IFrameRetry;

  /** if set true the field, create axios instance */
  useInstance: boolean;

  /** timeout of the request */
  timeout?: Milliseconds;

  /**
   * set authorizaiton header
   * eg. Bearer i-am-authorization-key
   * */
  authoriztion?: string | AxiosRequestConfig['auth'];
}
