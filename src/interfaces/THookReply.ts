import type { IDebugInfo } from '@interfaces/IDebugInfo';
import type { TPassJinEitherFrame } from '@interfaces/TPassJinEitherFrame';
import type { AxiosResponse } from 'axios';

export type TJinFramePostHookReply<TPASS> =
  | { kind: 'pass'; reply: AxiosResponse<TPASS>; debug: IDebugInfo }
  | { kind: 'fail'; err: Error; debug: IDebugInfo };

export type TJinEitherFramePostHookReply<TPASS> =
  | { kind: 'pass'; reply: TPassJinEitherFrame<TPASS>; debug: IDebugInfo }
  | { kind: 'fail'; err: Error; debug: IDebugInfo };
