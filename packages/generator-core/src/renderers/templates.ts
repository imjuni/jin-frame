import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import renderFrameSourceTemplate from "../../templates/frame.eta";
import renderBaseFrameSourceTemplate from "../../templates/base-frame.eta";
import renderHostFuncTemplate from "../../templates/host-function.eta";
import renderSecurityProviderSourceTemplate from "../../templates/security-provider.eta";

export interface ITemplateSet {
  frame: string;
  "base-frame": string;
  "host-function": string;
  "security-provider": string;
}

export const defaultTemplates: ITemplateSet = {
  frame: renderFrameSourceTemplate,
  "base-frame": renderBaseFrameSourceTemplate,
  "host-function": renderHostFuncTemplate,
  "security-provider": renderSecurityProviderSourceTemplate,
};

export async function loadTemplates(templatePath?: string): Promise<ITemplateSet> {
  const templates = { ...defaultTemplates };
  if (templatePath == null) {
    return templates;
  }
  for (const name of Object.keys(templates) as (keyof ITemplateSet)[]) {
    const path = resolve(templatePath, `${name}.eta`);
    try {
      templates[name] = await readFile(path, "utf8");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw new Error(`Failed to load template: ${path}`, { cause: error });
      }
    }
  }
  return templates;
}
