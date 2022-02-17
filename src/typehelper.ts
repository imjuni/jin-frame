import { AxiosRequestConfig } from 'axios';
import { IDebugInfo } from './IDebugInfo';
import type { JinFrame } from './JinFrame';

export type TWithFailJinFrame<T> = T & {
  type: 'fail';
  err: Error;
  $req: AxiosRequestConfig;
  debug: IDebugInfo;
  frame: JinFrame;
};
export type TWithPassJinFrame<T> = T & {
  type: 'pass';
  $req: AxiosRequestConfig;
  debug: IDebugInfo;
  frame: JinFrame;
};

export function convertor<T extends JinFrame>(frame: JinFrame): T {
  return frame as T;
}
