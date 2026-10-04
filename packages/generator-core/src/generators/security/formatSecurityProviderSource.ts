export function formatSecurityProviderSource(source: string): string {
  return source.replace(/(import[^\n]+;\n)(export class)/, "$1\n$2");
}
