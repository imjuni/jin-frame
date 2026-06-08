import type { OpenAPIV3 } from "openapi-types";
import type { IServerFrameEndpoint } from "#generators/frames/interfaces/IServerFrameEndpoint.js";

export interface IFrameGenerationContext {
  document: OpenAPIV3.Document;
  serverFrameEndpoint: IServerFrameEndpoint;
  host: string | (() => string);
  hostCode?: string;
}
