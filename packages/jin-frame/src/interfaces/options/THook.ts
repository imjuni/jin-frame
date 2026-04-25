import type { DebugInfo } from '#interfaces/DebugInfo';
import type { IFailReplyJinFrame } from '#interfaces/IFailJinEitherFrame';
import type { JinFailResp } from '#interfaces/JinFailResp';
import type { JinPassResp } from '#interfaces/JinPassResp';
import type { JinRequestConfig } from '#interfaces/JinRequestConfig';
import type { TPassJinFrame } from '#interfaces/TPassJinEitherFrame';
import type { AxiosResponse } from 'axios';

/**
 * Execute before request. If you can change request object that is affected request.
 *
 * @param req request object
 * */
export type PreEitherHook = (req: JinRequestConfig) => void | Promise<void>;

/**
 * Execute after request.
 *
 * @param req request object
 * @param reply [discriminated union](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#discriminated-unions) pass or fail
 */
export type PostEitherHook<TPASS, TFAIL> = (
  req: JinRequestConfig,
  reply: IFailReplyJinFrame<TFAIL> | TPassJinFrame<TPASS>,
) => void | Promise<void>;

/**
 * Execute before request. If you can change request object that is affected request.
 *
 * @param req request object
 * */
export type PreHook = (req: JinRequestConfig) => void | Promise<void>;

/**
 * Execute after request.
 *
 * @param req request object
 * @param reply reply object
 */
export type PostHook<TPASS, TFAIL> = (
  req: JinRequestConfig,
  reply: JinPassResp<TPASS> | JinFailResp<TFAIL>,
  debugInfo: DebugInfo,
) => void | Promise<void>;

export type RetryFailHook<TDATA> = (req: JinRequestConfig, res: AxiosResponse<TDATA>) => void | Promise<void>;
