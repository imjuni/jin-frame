import { randomUUID } from "node:crypto";
import type { Project } from "ts-morph";
import { createFrameData } from "#generators/frame/createFrameData.js";
import type { ICreateFrameProps } from "#generators/frame/interfaces/ICreateFrameProps.js";
import type { ICreateFrameResult } from "#generators/frame/interfaces/ICreateFrameResult.js";
import { renderFrameSource } from "#generators/frame/renderFrameSource.js";

export function createFrame(project: Project, params: ICreateFrameProps): ICreateFrameResult {
  const aliasFilePath = `${randomUUID()}-${randomUUID()}.ts`;
  const data = createFrameData(params);

  return {
    filePath: data.filePath,
    tag: data.tag,
    aliasFilePath,
    source: renderFrameSource(project, aliasFilePath, data),
  };
}
