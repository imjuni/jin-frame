import type { JinEitherFrame } from '#frames/JinEitherFrame';
import type { IDebugInfo } from '#interfaces/IDebugInfo';
import type { AxiosResponse } from 'axios';
import type { IPass } from 'my-only-either';

export type TPassJinEitherFrame<T> = AxiosResponse<T> & {
  $progress: 'pass';
  $debug: IDebugInfo;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $frame: JinEitherFrame<T, any>;
};

export type TJinPass<T> = IPass<TPassJinEitherFrame<T>>;
