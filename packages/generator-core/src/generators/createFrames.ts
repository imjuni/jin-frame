import $RefParser from "@apidevtools/json-schema-ref-parser";
import type { OpenAPIV3 } from "openapi-types";
import { createFrameGenerationContext } from "#generators/frames/createFrameGenerationContext.js";
import { createFramePipeline } from "#generators/frames/createFramePipeline.js";
import type { ICreateFramesProps } from "#generators/frames/interfaces/ICreateFramesProps.js";
import type { ICreateFramesResult } from "#generators/frames/interfaces/ICreateFramesResult.js";

export async function createFrames(params: ICreateFramesProps): Promise<ICreateFramesResult[]> {
  const document = await $RefParser.dereference<OpenAPIV3.Document>(params.document);
  const context = createFrameGenerationContext(params, document);

  return createFramePipeline({ params, context });
}
