import type { JinFrame } from '#frames/JinFrame';
import type { DebugInfo } from '#interfaces/DebugInfo';
import type { ValidationResult } from '#interfaces/ValidationResult';
import type { AxiosResponse } from 'axios';
import type { IFail } from 'my-only-either';

export interface IFailJinFrame<T = unknown> extends Pick<AxiosResponse, 'status' | 'statusText'> {
  /** exception class, $err representative message, stacktrace */
  $err: Error;

  /** debugging information */
  $debug: Omit<DebugInfo, 'req'>;

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
  $debug: DebugInfo;

  $validated: ValidationResult;
}

export type TJinFail<T> = IFail<IFailCreateJinFrame<T> | IFailReplyJinFrame<T>>;
