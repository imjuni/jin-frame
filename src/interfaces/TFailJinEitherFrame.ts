import type JinEitherFrame from '@frames/JinEitherFrame';
import type IDebugInfo from '@interfaces/IDebugInfo';
import type { AxiosResponse } from 'axios';

type TFailJinEitherFrame<T> = AxiosResponse<T> & {
  /** progress of jin-frame, fail representative success communication but result is fail */
  $progress: 'fail';

  /** exception class, $err representative message, stacktrace */
  $err: Error;

  /** debugging information */
  $debug: IDebugInfo;

  $frame: JinEitherFrame<any, T>;
};

export default TFailJinEitherFrame;
