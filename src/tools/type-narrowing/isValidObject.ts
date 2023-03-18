export default function isValidObject(value: unknown): value is Record<string, unknown> {
  if (typeof value === 'object' && value != null && !Array.isArray(value) && Object.values(value).length > 0) {
    return true;
  }

  return false;
}
