import type { JinEitherFrame } from '@frames/JinEitherFrame';
import type { IDebugInfo } from '@interfaces/IDebugInfo';
import type { AxiosResponse } from 'axios';
import { IPass } from 'my-only-either';

export type TPassJinEitherFrame<T> = AxiosResponse<T> & {
  $progress: 'pass';
  $debug: IDebugInfo;
  $frame: JinEitherFrame<T, any>;
};

export type TJinPass<T> = IPass<TPassJinEitherFrame<T>>;
