import { defaultTemplates, type ITemplateSet } from "#renderers/templates.js";
import util from "node:util";
import { renderTemplate } from "#renderers/renderTemplate.js";

export function renderHostFunc(hosts: string[], templates: ITemplateSet = defaultTemplates): string {
  const template = templates["host-function"];
  return renderTemplate(template, { hosts: util.inspect(hosts) }).trim();
}
