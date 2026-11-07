import type { ITemplateSet } from "#renderers/templates.js";
import type { ICreateFramesProps } from "#generators/frames/interfaces/ICreateFramesProps.js";
import type { IFrameGenerationContext } from "#generators/frames/interfaces/IFrameGenerationContext.js";

export interface ICreateFramePipelineParams {
  templates?: ITemplateSet;
  params: ICreateFramesProps;
  context: IFrameGenerationContext;
}
