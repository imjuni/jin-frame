import type { IFailCreateJinFrame, IFailReplyJinFrame } from '#interfaces/IFailJinEitherFrame';
import type { JinResp } from '#interfaces/JinResp';
import type { IJinFrameCreateConfig } from '#interfaces/options/IJinFrameCreateConfig';
import type { JinFrameRequestConfig } from '#interfaces/options/IJinFrameRequestConfig';
import type { TPassJinFrame } from '#interfaces/TPassJinEitherFrame';
import type { PassFailEither } from 'my-only-either';

export interface JinFrameFunction<Pass = unknown, Fail = Pass> {
  create: (
    args?: JinFrameRequestConfig & IJinFrameCreateConfig,
  ) =>
    | (() => Promise<JinResp<Pass, Fail>>)
    | (() => Promise<PassFailEither<IFailReplyJinFrame<Fail> | IFailCreateJinFrame<Fail>, TPassJinFrame<Pass>>>);

  execute: (
    args?: JinFrameRequestConfig & IJinFrameCreateConfig,
  ) =>
    | Promise<JinResp<Pass, Fail>>
    | Promise<PassFailEither<IFailReplyJinFrame<Fail> | IFailCreateJinFrame<Fail>, TPassJinFrame<Pass>>>;
}
