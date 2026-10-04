import type { Project } from "ts-morph";
import type { ICreateFramesProps } from "#generators/frames/interfaces/ICreateFramesProps.js";
import type { IFrameGenerationContext } from "#generators/frames/interfaces/IFrameGenerationContext.js";

export interface ICreateFramePipelineParams {
  params: ICreateFramesProps;
  context: IFrameGenerationContext;
  project?: Project;
}
