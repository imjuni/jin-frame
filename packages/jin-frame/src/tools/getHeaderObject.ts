export function getHeaderObject(headers: Headers): Record<string, string> {
  const headerObject: Record<string, string> = {};

  headers.forEach((value, key) => {
    headerObject[key] = value;
  });

  return headerObject;
}
