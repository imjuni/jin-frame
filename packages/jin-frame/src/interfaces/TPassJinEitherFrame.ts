import type { JinFrame } from '#frames/JinFrame';
import type { IDebugInfo } from '#interfaces/IDebugInfo';
import type { AxiosResponse } from 'axios';
import type { IPass } from 'my-only-either';

export type TPassJinFrame<T> = AxiosResponse<T> & {
  $progress: 'pass';
  $debug: IDebugInfo;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $frame: JinFrame<T, any>;
};

export type TJinPass<T> = IPass<TPassJinFrame<T>>;
