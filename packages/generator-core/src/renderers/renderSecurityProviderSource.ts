import { defaultTemplates, type ITemplateSet } from "#renderers/templates.js";
import type { ISecurityProviderData } from "#generators/security/interfaces/ISecurityProviderData.js";
import { renderTemplate } from "#renderers/renderTemplate.js";

export function renderSecurityProviderSource(
  data: ISecurityProviderData,
  templates: ITemplateSet = defaultTemplates,
): string {
  const template = templates["security-provider"];
  return renderTemplate(template, { ...data, arguments: data.constructorArguments.join(", ") }).trim();
}
