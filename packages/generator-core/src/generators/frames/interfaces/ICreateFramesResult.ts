import type { createFrame } from "#/generators/createFrame.js";
import type { THttpMethod } from "#/https/method.js";

export interface ICreateFramesResult {
  method: THttpMethod;
  pathKey: string;
  frame: ReturnType<typeof createFrame>;
}
