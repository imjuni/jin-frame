import { loadTemplates } from "#renderers/templates.js";
import $RefParser from "@apidevtools/json-schema-ref-parser";
import type { OpenAPIV3, OpenAPIV3_1 } from "openapi-types";
import { createFrameGenerationContext } from "#generators/frames/createFrameGenerationContext.js";
import { createFramePipeline } from "#generators/frames/createFramePipeline.js";
import type { ICreateFramesProps } from "#generators/frames/interfaces/ICreateFramesProps.js";
import type { ICreateFramesResult } from "#generators/frames/interfaces/ICreateFramesResult.js";

export async function createFrames(params: ICreateFramesProps): Promise<ICreateFramesResult[]> {
  params.onEvent?.({ type: "stage", stage: "resolve-references", state: "started" });
  const document = await $RefParser.dereference<OpenAPIV3.Document | OpenAPIV3_1.Document>(params.document);
  params.onEvent?.({ type: "stage", stage: "resolve-references", state: "completed" });
  const operationalDocument = document as OpenAPIV3.Document;
  const context = createFrameGenerationContext(params, operationalDocument);

  params.onEvent?.({ type: "stage", stage: "load-templates", state: "started" });
  const templates = await loadTemplates(params.templatePath);
  params.onEvent?.({ type: "stage", stage: "load-templates", state: "completed" });
  params.onEvent?.({ type: "stage", stage: "generate-frames", state: "started" });
  const result = createFramePipeline({ params, context, templates });
  params.onEvent?.({ type: "stage", stage: "generate-frames", state: "completed" });
  return result;
}
