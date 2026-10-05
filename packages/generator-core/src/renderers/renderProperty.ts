import type { IPropertyData } from "#generators/interfaces/IPropertyData.js";
import { renderDoc } from "#renderers/renderDoc.js";

export function renderProperty(property: IPropertyData): string {
  const docs = property.docs.map((doc) => renderDoc(doc, "    "));
  const decorators = property.decorators.map(
    (decorator) => `    @${decorator.name}(${decorator.arguments.join(", ")})`,
  );
  const declaration = `    ${property.hasDeclareKeyword ? "declare " : ""}public ${property.isReadonly ? "readonly " : ""}${property.name}${property.hasQuestionToken ? "?" : ""}${property.type != null ? `: ${property.type}` : ""};`;
  const template = [...docs, ...decorators, declaration].join("\n");
  return template;
}
