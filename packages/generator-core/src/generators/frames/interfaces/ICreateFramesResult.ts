import type { createFrame } from "#/generators/createFrame";
import type { THttpMethod } from "#/https/method";

export interface ICreateFramesResult {
  method: THttpMethod;
  pathKey: string;
  frame: ReturnType<typeof createFrame>;
}
