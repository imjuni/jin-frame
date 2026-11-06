import type { DebugInfo } from "#interfaces/DebugInfo";
import type { JinResp } from "#interfaces/JinResp";
import type { JinRequestConfig } from "#interfaces/JinRequestConfig";

export type PostHook<Response> = (
  req: JinRequestConfig,
  reply: JinResp<Response>,
  debugInfo: DebugInfo,
) => void | Promise<void>;
