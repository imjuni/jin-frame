import type { IJinFrameCreateConfig } from '#interfaces/options/IJinFrameCreateConfig';
import type { JinFrameRequestConfig } from '#interfaces/options/IJinFrameRequestConfig';
import type { JinResp } from '#interfaces/JinResp';

export interface JinFrameFunction<Pass = unknown, Fail = Pass> {
  create: (args?: JinFrameRequestConfig & IJinFrameCreateConfig) => () => Promise<JinResp<Pass, Fail>>;

  execute: (args?: JinFrameRequestConfig & IJinFrameCreateConfig) => Promise<JinResp<Pass, Fail>>;
}
