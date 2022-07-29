export function removeEndSlash(value: string): string {
  return value.endsWith('/') ? value.slice(0, value.length - 1) : value;
}

export function removeStartSlash(value: string): string {
  return value.startsWith('/') ? value.slice(1, value.length) : value;
}

export function removeBothSlash(value: string): string {
  return removeStartSlash(removeEndSlash(value));
}

export function startWithSlash(value: string): string {
  return value.startsWith('/') ? value : `/${value}`;
}
