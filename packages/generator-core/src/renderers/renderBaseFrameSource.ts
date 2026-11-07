import type { IBaseFrameData } from "#generators/base-frame/interfaces/IBaseFrameData.js";
import { renderDecorator } from "#renderers/renderDecorator.js";
import { renderDoc } from "#renderers/renderDoc.js";
import { renderImports } from "#renderers/renderImports.js";
import { renderProperty } from "#renderers/renderProperty.js";
import { renderTemplate } from "#renderers/renderTemplate.js";

export function renderBaseFrameSource(data: IBaseFrameData): string {
  const template = `
<%~ it.imports %>

<%~ it.docs %>
<%~ it.decorators %>
export class <%~ it.name %><<%~ it.typeParameters %>> extends <%~ it.extends %> {
<%~ it.properties %><%~ it.methods %>}
`;
  return renderTemplate(template, {
    imports: renderImports(data.imports),
    docs: renderDoc(data.docs),
    decorators: data.decorators.map(renderDecorator).join("\n"),
    name: data.name,
    typeParameters: data.typeParameters
      .map(
        (type) =>
          `${type.name}${type.constraint ? ` extends ${type.constraint}` : ""}${type.default ? ` = ${type.default}` : ""}`,
      )
      .join(", "),
    extends: data.extends,
    properties: data.properties.length ? `${data.properties.map(renderProperty).join("\n")}\n` : "",
    methods: data.methods
      .map(
        (method) =>
          `    protected static override ${method.name}(): ${method.returnType} {\n${method.statements.map((statement) => `        ${statement}`).join("\n")}\n    }\n`,
      )
      .join(""),
  }).trim();
}
