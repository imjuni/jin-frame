import type { IGeneratorObserverOptions } from "#generators/interfaces/IGeneratorObserverOptions.js";
import type { OpenAPITSOptions } from "openapi-typescript";

export interface ICreateOpenapiTsOptions extends OpenAPITSOptions, IGeneratorObserverOptions {
  int64AsString?: boolean;
}
