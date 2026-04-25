import type { DebugInfo } from '#interfaces/DebugInfo';
import type { JinFailResp } from '#interfaces/JinFailResp';
import type { JinPassResp } from '#interfaces/JinPassResp';
import type { JinRequestConfig } from '#interfaces/JinRequestConfig';
import type { JinResp } from '#interfaces/JinResp';

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
export type PostHook<Pass, Fail> = (
  req: JinRequestConfig,
  reply: JinPassResp<Pass> | JinFailResp<Fail>,
  debugInfo: DebugInfo,
) => void | Promise<void>;

export type RetryFailHook<Pass, Fail> = (req: JinRequestConfig, res: JinResp<Pass, Fail>) => void | Promise<void>;
