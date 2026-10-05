import type { ISecurityProviderData } from "#generators/security/interfaces/ISecurityProviderData.js";
import { renderTemplate } from "#renderers/renderTemplate.js";

export function renderSecurityProviderSource(data: ISecurityProviderData): string {
  const template = `
import { <%~ it.builtinClassName %> } from "jin-frame";

export class <%~ it.className %> extends <%~ it.builtinClassName %> {
    public constructor() {
        super(<%~ it.arguments %>);
    }
}
`;
  return renderTemplate(template, { ...data, arguments: data.constructorArguments.join(", ") }).trim();
}
