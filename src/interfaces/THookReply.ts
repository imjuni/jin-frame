import type { IDebugInfo } from '@interfaces/IDebugInfo';
import type { IFailReplyJinEitherFrame } from '@interfaces/IFailJinEitherFrame';
import type { TPassJinEitherFrame } from '@interfaces/TPassJinEitherFrame';
import type { AxiosResponse } from 'axios';

export type TJinFramePostHookReply<TPASS, TFAIL> =
  | { kind: 'pass'; reply: AxiosResponse<TPASS>; debug: IDebugInfo }
  | { kind: 'fail'; reply: AxiosResponse<TFAIL>; err: Error; debug: IDebugInfo };

export type TJinEitherFramePostHookReply<TPASS, TFAIL> =
  | { kind: 'pass'; reply: TPassJinEitherFrame<TPASS> }
  | { kind: 'fail'; reply: IFailReplyJinEitherFrame<TFAIL>; err: Error };
