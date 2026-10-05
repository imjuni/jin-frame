import type { IFrameDataImport } from "#generators/frame/interfaces/IFrameDataImport.js";

export function renderImports(imports: IFrameDataImport[]): string {
  const template = imports
    .map((entry) => `import { ${entry.namedImports.join(", ")} } from ${JSON.stringify(entry.moduleSpecifier)};`)
    .join("\n");
  return template;
}
