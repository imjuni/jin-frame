import type { Project } from "ts-morph";
import { createBaseFrameData } from "#generators/base-frame/createBaseFrameData.js";
import { createBaseFrameFromData } from "#generators/base-frame/createBaseFrameFromData.js";
import type { ICreateBaseFrameProps } from "#generators/base-frame/interfaces/ICreateBaseFrameProps.js";
import type { ICreateBaseFrameResult } from "#generators/base-frame/interfaces/ICreateBaseFrameResult.js";

export function createBaseFrame(project: Project, params: ICreateBaseFrameProps): ICreateBaseFrameResult {
  return createBaseFrameFromData(project, createBaseFrameData(params));
}
