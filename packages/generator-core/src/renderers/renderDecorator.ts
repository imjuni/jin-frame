export function renderDecorator(decorator: { name: string; arguments?: string[] }): string {
  const template = `@${decorator.name}(${(decorator.arguments ?? []).join(", ")})`;
  return template;
}
