import type { IFailCreateJinEitherFrame, IFailReplyJinEitherFrame } from '#interfaces/IFailJinEitherFrame';
import type { IJinFrameCreateConfig } from '#interfaces/options/IJinFrameCreateConfig';
import type { IJinFrameRequestConfig } from '#interfaces/options/IJinFrameRequestConfig';
import type { TPassJinEitherFrame } from '#interfaces/TPassJinEitherFrame';
import type { AxiosResponse } from 'axios';
import type { PassFailEither } from 'my-only-either';

export interface IJinFrameFunction<TPASS = unknown, TFAIL = TPASS> {
  create: (
    args?: IJinFrameRequestConfig & IJinFrameCreateConfig,
  ) =>
    | (() => Promise<AxiosResponse<TPASS>>)
    | (() => Promise<
        PassFailEither<IFailReplyJinEitherFrame<TFAIL> | IFailCreateJinEitherFrame<TFAIL>, TPassJinEitherFrame<TPASS>>
      >);

  execute: (
    args?: IJinFrameRequestConfig & IJinFrameCreateConfig,
  ) =>
    | Promise<AxiosResponse<TPASS>>
    | Promise<
        PassFailEither<IFailReplyJinEitherFrame<TFAIL> | IFailCreateJinEitherFrame<TFAIL>, TPassJinEitherFrame<TPASS>>
      >;
}
