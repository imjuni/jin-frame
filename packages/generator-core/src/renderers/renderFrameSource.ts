import { defaultTemplates, type ITemplateSet } from "#renderers/templates.js";
import type { IFrameData } from "#generators/frame/interfaces/IFrameData.js";
import { renderDecorator } from "#renderers/renderDecorator.js";
import { renderDoc } from "#renderers/renderDoc.js";
import { renderImports } from "#renderers/renderImports.js";
import { renderProperty } from "#renderers/renderProperty.js";
import { renderTemplate } from "#renderers/renderTemplate.js";

export function renderFrameSource(data: IFrameData, templates: ITemplateSet = defaultTemplates): string {
  const template = templates["frame"];
  return renderTemplate(template, {
    imports:
      renderImports(data.imports) +
      (data.typeAliases.some((alias) => alias.name === "OperationResponse")
        ? '\nimport { validateStatus } from "jin-frame";'
        : ""),
    aliases: data.typeAliases
      .map(
        (alias) =>
          `${renderDoc(alias.docs?.[0]?.description ?? "", "", true)}\ntype ${alias.name} = ${alias.type};\n\n`,
      )
      .join(""),
    docs: renderDoc(data.docs),
    decorators: data.decorators.map(renderDecorator).join("\n"),
    name: data.name,
    parentFrame: data.parentFrame,
    responseTypes: data.responseTypes.join(", "),
    properties: [
      ...(data.typeAliases.some((alias) => alias.name === "OperationResponse")
        ? [
            `public override readonly _defaultValidateStatus = validateStatus(${[...new Set(data.typeAliases.filter((alias) => alias.name === "OperationResponse").flatMap((alias) => [...alias.type.matchAll(/status: (2\d{2});/g)].map((match) => Number(match[1]))))].join(", ")});`,
          ]
        : []),
      ...data.properties.map(renderProperty),
    ].join("\n"),
  }).trim();
}
