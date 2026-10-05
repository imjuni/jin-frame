export function renderDoc(description: string, indent = "", expanded = false): string {
  const lines = description.split("\n");
  if (lines.length === 1 && !expanded) {
    const template = `${indent}/** ${(lines[0] ?? "").replaceAll("*/", "* /")} */`;
    return template;
  }

  const template = [
    `${indent}/**`,
    ...lines.map((line) => `${indent} *${line ? ` ${line.replaceAll("*/", "* /")}` : ""}`),
    `${indent} */`,
  ].join("\n");
  return template;
}
