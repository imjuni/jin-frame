import type JinEitherFrame from '@frames/JinEitherFrame';
import type IDebugInfo from '@interfaces/IDebugInfo';

type TFailExceptionJinEitherFrame<T> = {
  $progress: 'error';
  $err: Error;
  $debug: IDebugInfo;
  $frame: JinEitherFrame<any, T>;
};

export default TFailExceptionJinEitherFrame;
