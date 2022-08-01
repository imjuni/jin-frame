import type { JinEitherFrame } from '@frames/JinEitherFrame';
import type { IDebugInfo } from '@interfaces/IDebugInfo';

export type TFailExceptionJinEitherFrame<T> = {
  $progress: 'error';
  $err: Error;
  $debug: IDebugInfo;
  $frame: JinEitherFrame<any, T>;
};
