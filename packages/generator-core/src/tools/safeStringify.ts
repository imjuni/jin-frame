export function safeStringify(
  value: Parameters<typeof JSON.stringify>[0],
  replacer?: Parameters<typeof JSON.stringify>[1],
  spacer?: Parameters<typeof JSON.stringify>[2],
): string {
  try {
    return JSON.stringify(value, replacer, spacer);
  } catch {
    return '';
  }
}
