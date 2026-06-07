import type { IGetServerParams } from "#/generators/hosts/interfaces/IGetServerParams.js";

export interface IGetBaseHostParams {
  host?: string;
  spec: IGetServerParams["specPath"];
}
