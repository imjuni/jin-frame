export default function startWithSlash(value: string): string {
  return value.startsWith('/') ? value : `/${value}`;
}
