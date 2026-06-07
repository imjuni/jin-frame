import type { JinResp } from "#interfaces/JinResp";
import type { JinFrameCreateConfig } from "#interfaces/options/JinFrameCreateConfig";
import type { JinFrameRequestConfig } from "#interfaces/options/JinFrameRequestConfig";

export interface JinFrameFunction<Pass = unknown, Fail = Pass> {
  _create: (args?: JinFrameRequestConfig & JinFrameCreateConfig) => () => Promise<JinResp<Pass, Fail>>;

  _execute: (args?: JinFrameRequestConfig & JinFrameCreateConfig) => Promise<JinResp<Pass, Fail>>;
}
