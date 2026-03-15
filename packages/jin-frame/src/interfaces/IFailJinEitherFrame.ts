import type { JinFrame } from '#frames/JinFrame';
import type { IDebugInfo } from '#interfaces/IDebugInfo';
import type { TValidationResult } from '#interfaces/TValidationResult';
import type { AxiosResponse } from 'axios';
import type { IFail } from 'my-only-either';

export interface IFailJinFrame<T = unknown> extends Pick<AxiosResponse, 'status' | 'statusText'> {
  /** exception class, $err representative message, stacktrace */
  $err: Error;

  /** debugging information */
  $debug: Omit<IDebugInfo, 'req'>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $frame: JinFrame<any, T>;
}

export interface IFailCreateJinFrame<T = unknown> extends IFailJinFrame<T> {
  /** progress of jin-frame, error representative mostly raise exception from axios.request */
  $progress: 'error';
}

export interface IFailReplyJinFrame<T = unknown> extends AxiosResponse<T>, IFailJinFrame<T> {
  /** progress of jin-frame, fail representative success communication but result is fail */
  $progress: 'fail';

  /** debugging information */
  $debug: IDebugInfo;

  $validated: TValidationResult;
}

export type TJinFail<T> = IFail<IFailCreateJinFrame<T> | IFailReplyJinFrame<T>>;
