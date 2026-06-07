import type { OpenAPIV3 } from "openapi-types";
import type { IHostStrategyOptions } from "#/generators/hosts/interfaces/IHostStrategyOptions.js";

export interface IGenerateHostValueParams {
  servers: OpenAPIV3.ServerObject[];
  options: IHostStrategyOptions;
}
