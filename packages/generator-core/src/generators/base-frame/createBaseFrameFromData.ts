import type { ITemplateSet } from "#renderers/templates.js";
import { randomUUID } from "node:crypto";
import type { IBaseFrameData } from "#generators/base-frame/interfaces/IBaseFrameData.js";
import type { ICreateBaseFrameResult } from "#generators/base-frame/interfaces/ICreateBaseFrameResult.js";
import { renderBaseFrameSource } from "#renderers/renderBaseFrameSource.js";

export function createBaseFrameFromData(data: IBaseFrameData, templates?: ITemplateSet): ICreateBaseFrameResult {
  const aliasFilePath = `${randomUUID()}-${randomUUID()}.ts`;

  return {
    filePath: data.filePath,
    tag: undefined,
    aliasFilePath,
    source: renderBaseFrameSource(data, templates),
  };
}
