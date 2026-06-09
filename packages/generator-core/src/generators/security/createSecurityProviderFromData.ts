import { randomUUID } from "node:crypto";
import type { Project } from "ts-morph";
import type { ICreateFrameResult } from "#generators/frame/interfaces/ICreateFrameResult.js";
import type { ISecurityProviderData } from "#generators/security/interfaces/ISecurityProviderData.js";
import { renderSecurityProviderSource } from "#generators/security/renderSecurityProviderSource.js";

export function createSecurityProviderFromData(project: Project, data: ISecurityProviderData): ICreateFrameResult {
  const aliasFilePath = `${randomUUID()}-${randomUUID()}.ts`;

  return {
    filePath: data.filePath,
    tag: data.tag,
    aliasFilePath,
    source: renderSecurityProviderSource(project, aliasFilePath, data),
  };
}
