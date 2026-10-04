export function formatFrameSource(source: string): string {
  return source
    .replaceAll(/\/\*\* (Response DTO|Request DTO) \*\//g, "/**\n * $1\n */")
    .replace(/(import[^\n]+;\n)(\/\*\*)/, "$1\n$2")
    .replaceAll(/(type [^;]+;)\n(\/\*\*)/g, "$1\n\n$2");
}
