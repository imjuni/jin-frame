import type { THttpMethod } from "#/https/method";

export interface IGetFrameNameProps {
  pathKey: string;
  method: THttpMethod;
  operationId?: string;
}
