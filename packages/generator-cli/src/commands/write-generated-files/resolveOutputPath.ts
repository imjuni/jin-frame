import pathe from "pathe";

export function resolveOutputPath(output: string, relativePath: string): string {
  const root = pathe.resolve(output);
  const target = pathe.resolve(root, relativePath);
  const relative = pathe.relative(root, target);

  if (relative === "" || relative.startsWith("../") || pathe.isAbsolute(relative)) {
    throw new Error(`Generated file path escapes the output directory: "${relativePath}"`);
  }

  return target;
}
