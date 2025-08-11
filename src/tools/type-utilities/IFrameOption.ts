import type { IFrameRetry } from '#interfaces/IFrameRetry';
import type { AxiosRequestConfig, Method, Milliseconds } from 'axios';

export interface IFrameOption {
  /** host of API Request endpoint */
  host: string;

  /** pathname of API Request endpoint */
  path: string;

  /** method of API Request endpoint */
  method: Method;

  /** content-type of API Request endpoint */
  contentType: string;

  /** user agent of API Request endpoint */
  userAgent?: string;

  /** custom object of POST Request body data */
  customBody?: unknown;

  /** transformRequest function of POST Request */
  transformRequest?: AxiosRequestConfig['transformRequest'];

  retry?: IFrameRetry;

  useInstance: boolean;

  timeout?: Milliseconds;

  // hook?: {
  //   /**
  //    * Execute before request. If you can change request object that is affected request.
  //    *
  //    * @param this this instance
  //    * @param req request object
  //    * */
  //   pre?: (req: TJinRequestConfig) => void | Promise<void>;

  //   /**
  //    * Execute after request.
  //    *
  //    * @param this this instance
  //    * @param req request object
  //    * @param result [discriminated union](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#discriminated-unions) pass or fail
  //    */
  //   post?: (
  //     req: TJinRequestConfig,
  //     reply: IFailReplyJinEitherFrame<TFAIL> | TPassJinEitherFrame<TPASS>,
  //   ) => void | Promise<void>;

  //   /**
  //    * Execute before request. If you can change request object that is affected request.
  //    *
  //    * @param this this instance
  //    * @param req request object
  //    * */
  //   retryFail?: <TDATA>(req: TJinRequestConfig, res: AxiosResponse<TDATA>) => void | Promise<void>;
  // };
}
