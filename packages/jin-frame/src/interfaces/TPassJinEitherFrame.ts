import type { JinFrame } from '#frames/JinFrame';
import type { DebugInfo } from '#interfaces/DebugInfo';
import type { AxiosResponse } from 'axios';
import type { IPass } from 'my-only-either';

export type TPassJinFrame<T> = AxiosResponse<T> & {
  $progress: 'pass';
  $debug: DebugInfo;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $frame: JinFrame<T, any>;
};

export type TJinPass<T> = IPass<TPassJinFrame<T>>;
