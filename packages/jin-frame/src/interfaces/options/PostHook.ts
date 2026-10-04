import type { DebugInfo } from "#interfaces/DebugInfo";
import type { JinFailResp } from "#interfaces/JinFailResp";
import type { JinPassResp } from "#interfaces/JinPassResp";
import type { JinRequestConfig } from "#interfaces/JinRequestConfig";

export type PostHook<Pass, Fail> = (
  req: JinRequestConfig,
  reply: JinPassResp<Pass> | JinFailResp<Fail>,
  debugInfo: DebugInfo,
) => void | Promise<void>;
