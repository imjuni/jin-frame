import type { JinEitherFrame } from '@frames/JinEitherFrame';
import type { IDebugInfo } from '@interfaces/IDebugInfo';
import type { AxiosResponse } from 'axios';

export type TPassJinEitherFrame<T> = AxiosResponse<T> & {
  $progress: 'pass';
  $debug: IDebugInfo;
  $frame: JinEitherFrame<T, any>;
};
