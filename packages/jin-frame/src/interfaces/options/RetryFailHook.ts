import type { JinRequestConfig } from "#interfaces/JinRequestConfig";
import type { JinResp, JinResponse } from "#interfaces/JinResp";

export type RetryFailHook<Response extends JinResponse> = (
  req: JinRequestConfig,
  res: JinResp<Response>,
) => void | Promise<void>;
