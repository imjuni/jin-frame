export function splitEndpointOverride(value: string): [string, string] | undefined {
  const index = value.indexOf("=");
  if (index < 0) return undefined;
  const key = value.slice(0, index).trim();
  const raw = value.slice(index + 1).trim();
  return !key.startsWith("/") || raw.length === 0 ? undefined : [key, raw];
}
