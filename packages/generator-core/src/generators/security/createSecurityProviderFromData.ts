import { randomUUID } from "node:crypto";
import type { ICreateFrameResult } from "#generators/frame/interfaces/ICreateFrameResult.js";
import type { ISecurityProviderData } from "#generators/security/interfaces/ISecurityProviderData.js";
import { renderSecurityProviderSource } from "#renderers/renderSecurityProviderSource.js";

export function createSecurityProviderFromData(data: ISecurityProviderData): ICreateFrameResult {
  const aliasFilePath = `${randomUUID()}-${randomUUID()}.ts`;

  return {
    filePath: data.filePath,
    tag: data.tag,
    aliasFilePath,
    source: renderSecurityProviderSource(data),
  };
}
