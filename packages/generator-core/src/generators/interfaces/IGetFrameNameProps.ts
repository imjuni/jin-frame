import type { THttpMethod } from "#/https/method.js";

export interface IGetFrameNameProps {
  pathKey: string;
  method: THttpMethod;
  operationId?: string;
}
