import type { DebugInfo } from "#interfaces/DebugInfo";
import type { JinResp, JinResponse } from "#interfaces/JinResp";
import type { JinRequestConfig } from "#interfaces/JinRequestConfig";

export type PostHook<Response extends JinResponse> = (
  req: JinRequestConfig,
  reply: JinResp<Response>,
  debugInfo: DebugInfo,
) => void | Promise<void>;
