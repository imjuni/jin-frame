import type { IDebugInfo } from '#interfaces/IDebugInfo';
import type { IFailReplyJinEitherFrame } from '#interfaces/IFailJinEitherFrame';
import type { TJinRequestConfig } from '#interfaces/TJinFrameResponse';
import type { TPassJinEitherFrame } from '#interfaces/TPassJinEitherFrame';
import type { AxiosResponse } from 'axios';

/**
 * Execute before request. If you can change request object that is affected request.
 *
 * @param req request object
 * */
export type TPreEitherHook = (req: TJinRequestConfig) => void | Promise<void>;

/**
 * Execute after request.
 *
 * @param req request object
 * @param reply [discriminated union](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#discriminated-unions) pass or fail
 */
export type TPostEitherHook<TPASS, TFAIL> = (
  req: TJinRequestConfig,
  reply: IFailReplyJinEitherFrame<TFAIL> | TPassJinEitherFrame<TPASS>,
) => void | Promise<void>;

/**
 * Execute before request. If you can change request object that is affected request.
 *
 * @param req request object
 * */
export type TPreHook = (req: TJinRequestConfig) => void | Promise<void>;

/**
 * Execute after request.
 *
 * @param req request object
 * @param reply reply object
 */
export type TPostHook<TPASS, TFAIL> = (
  req: TJinRequestConfig,
  reply: AxiosResponse<TPASS | TFAIL>,
  debugInfo: IDebugInfo,
) => void | Promise<void>;

export type TRetryFailHook<TDATA> = (req: TJinRequestConfig, res: AxiosResponse<TDATA>) => void | Promise<void>;
