import type { JinEitherFrame } from '@frames/JinEitherFrame';
import type { IDebugInfo } from '@interfaces/IDebugInfo';
import type { AxiosResponse } from 'axios';

export interface IFailJinEitherFrame<T> extends Pick<AxiosResponse, 'status' | 'statusText'> {
  /** exception class, $err representative message, stacktrace */
  $err: Error;

  /** debugging information */
  $debug: IDebugInfo;

  $frame: JinEitherFrame<any, T>;
}

export interface IFailExceptionJinEitherFrame<T> extends IFailJinEitherFrame<T> {
  /** progress of jin-frame, error representative mostly raise exception from axios.request */
  $progress: 'error';
}

export interface IFailReplyJinEitherFrame<T> extends AxiosResponse<T>, IFailJinEitherFrame<T> {
  /** progress of jin-frame, fail representative success communication but result is fail */
  $progress: 'fail';
}
