import type { JinEitherFrame } from '#frames/JinEitherFrame';
import type { IDebugInfo } from '#interfaces/IDebugInfo';
import type { AxiosResponse } from 'axios';
import type { IFail } from 'my-only-either';

export interface IFailJinEitherFrame<T = unknown> extends Pick<AxiosResponse, 'status' | 'statusText'> {
  /** exception class, $err representative message, stacktrace */
  $err: Error;

  /** debugging information */
  $debug: Omit<IDebugInfo, 'req'>;

  $frame: JinEitherFrame<any, T>;
}

export interface IFailCreateJinEitherFrame<T = unknown> extends IFailJinEitherFrame<T> {
  /** progress of jin-frame, error representative mostly raise exception from axios.request */
  $progress: 'error';
}

export interface IFailReplyJinEitherFrame<T = unknown> extends AxiosResponse<T>, IFailJinEitherFrame<T> {
  /** progress of jin-frame, fail representative success communication but result is fail */
  $progress: 'fail';

  /** debugging information */
  $debug: IDebugInfo;
}

export type TJinFail<T> = IFail<IFailCreateJinEitherFrame<T> | IFailReplyJinEitherFrame<T>>;
