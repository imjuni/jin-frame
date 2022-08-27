import type { JinEitherFrame } from '@frames/JinEitherFrame';
import type { IDebugInfo } from '@interfaces/IDebugInfo';
import type { AxiosResponse } from 'axios';

export type TFailExceptionJinEitherFrame<T> = Pick<AxiosResponse, 'status' | 'statusText'> & {
  $progress: 'error';
  $err: Error;
  $debug: IDebugInfo;
  $frame: JinEitherFrame<any, T>;
};
