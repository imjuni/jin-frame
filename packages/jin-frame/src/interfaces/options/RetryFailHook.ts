import type { JinRequestConfig } from "#interfaces/JinRequestConfig";
import type { JinResp } from "#interfaces/JinResp";

export type RetryFailHook<Pass, Fail> = (req: JinRequestConfig, res: JinResp<Pass, Fail>) => void | Promise<void>;
