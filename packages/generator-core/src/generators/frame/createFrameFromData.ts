import type { ITemplateSet } from "#renderers/templates.js";
import { randomUUID } from "node:crypto";
import type { ICreateFrameResult } from "#generators/frame/interfaces/ICreateFrameResult.js";
import type { IFrameData } from "#generators/frame/interfaces/IFrameData.js";
import { renderFrameSource } from "#renderers/renderFrameSource.js";

export function createFrameFromData(data: IFrameData, templates?: ITemplateSet): ICreateFrameResult {
  const aliasFilePath = `${randomUUID()}-${randomUUID()}.ts`;

  return {
    filePath: data.filePath,
    tag: data.tag,
    aliasFilePath,
    source: renderFrameSource(data, templates),
  };
}
