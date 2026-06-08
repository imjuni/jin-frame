import { randomUUID } from "node:crypto";
import type { Project } from "ts-morph";
import type { IBaseFrameData } from "#generators/base-frame/interfaces/IBaseFrameData.js";
import type { ICreateBaseFrameResult } from "#generators/base-frame/interfaces/ICreateBaseFrameResult.js";
import { renderBaseFrameSource } from "#generators/base-frame/renderBaseFrameSource.js";

export function createBaseFrameFromData(project: Project, data: IBaseFrameData): ICreateBaseFrameResult {
  const aliasFilePath = `${randomUUID()}-${randomUUID()}.ts`;

  return {
    filePath: data.filePath,
    tag: undefined,
    aliasFilePath,
    source: renderBaseFrameSource(project, aliasFilePath, data),
  };
}
