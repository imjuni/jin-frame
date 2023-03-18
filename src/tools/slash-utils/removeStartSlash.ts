export default function removeStartSlash(value: string): string {
  return value.startsWith('/') ? value.slice(1, value.length) : value;
}
