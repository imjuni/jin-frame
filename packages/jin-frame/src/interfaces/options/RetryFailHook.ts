import type { JinRequestConfig } from "#interfaces/JinRequestConfig";
import type { JinResp } from "#interfaces/JinResp";

export type RetryFailHook<Response> = (req: JinRequestConfig, res: JinResp<Response>) => void | Promise<void>;
