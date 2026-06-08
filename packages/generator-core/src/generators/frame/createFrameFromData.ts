import { randomUUID } from "node:crypto";
import type { Project } from "ts-morph";
import type { ICreateFrameResult } from "#generators/frame/interfaces/ICreateFrameResult.js";
import type { IFrameData } from "#generators/frame/interfaces/IFrameData.js";
import { renderFrameSource } from "#generators/frame/renderFrameSource.js";

export function createFrameFromData(project: Project, data: IFrameData): ICreateFrameResult {
  const aliasFilePath = `${randomUUID()}-${randomUUID()}.ts`;

  return {
    filePath: data.filePath,
    tag: data.tag,
    aliasFilePath,
    source: renderFrameSource(project, aliasFilePath, data),
  };
}
