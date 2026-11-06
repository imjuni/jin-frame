import type { JinResponse, JinResp } from "#interfaces/JinResp";
import type { JinFrameCreateConfig } from "#interfaces/options/JinFrameCreateConfig";
import type { JinFrameRequestConfig } from "#interfaces/options/JinFrameRequestConfig";

export interface JinFrameFunction<Response = JinResponse> {
  _create: (args?: JinFrameRequestConfig & JinFrameCreateConfig) => () => Promise<JinResp<Response>>;

  _execute: (args?: JinFrameRequestConfig & JinFrameCreateConfig) => Promise<JinResp<Response>>;
}
