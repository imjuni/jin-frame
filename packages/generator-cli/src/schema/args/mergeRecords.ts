export function mergeRecords<T>(left?: Record<string, T>, right?: Record<string, T>): Record<string, T> | undefined {
  const merged = { ...(left ?? {}), ...(right ?? {}) };
  return Object.keys(merged).length > 0 ? merged : undefined;
}
