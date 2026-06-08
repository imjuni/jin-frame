import type { Project } from "ts-morph";
import { createFrameData } from "#generators/frame/createFrameData.js";
import { createFrameFromData } from "#generators/frame/createFrameFromData.js";
import type { ICreateFrameProps } from "#generators/frame/interfaces/ICreateFrameProps.js";
import type { ICreateFrameResult } from "#generators/frame/interfaces/ICreateFrameResult.js";

export function createFrame(project: Project, params: ICreateFrameProps): ICreateFrameResult {
  const data = createFrameData(params);
  return createFrameFromData(project, data);
}
