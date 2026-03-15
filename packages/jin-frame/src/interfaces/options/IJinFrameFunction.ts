import type { IFailCreateJinFrame, IFailReplyJinFrame } from '#interfaces/IFailJinEitherFrame';
import type { IJinFrameCreateConfig } from '#interfaces/options/IJinFrameCreateConfig';
import type { IJinFrameRequestConfig } from '#interfaces/options/IJinFrameRequestConfig';
import type { TPassJinFrame } from '#interfaces/TPassJinEitherFrame';
import type { AxiosResponse } from 'axios';
import type { PassFailEither } from 'my-only-either';

export interface IJinFrameFunction<TPASS = unknown, TFAIL = TPASS> {
  create: (
    args?: IJinFrameRequestConfig & IJinFrameCreateConfig,
  ) =>
    | (() => Promise<AxiosResponse<TPASS>>)
    | (() => Promise<PassFailEither<IFailReplyJinFrame<TFAIL> | IFailCreateJinFrame<TFAIL>, TPassJinFrame<TPASS>>>);

  execute: (
    args?: IJinFrameRequestConfig & IJinFrameCreateConfig,
  ) =>
    | Promise<AxiosResponse<TPASS>>
    | Promise<PassFailEither<IFailReplyJinFrame<TFAIL> | IFailCreateJinFrame<TFAIL>, TPassJinFrame<TPASS>>>;
}
