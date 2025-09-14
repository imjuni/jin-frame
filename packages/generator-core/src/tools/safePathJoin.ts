import pathe from 'pathe';

export function safePathJoin(...paths: unknown[]): string {
  return pathe.join(...paths.filter((path) => typeof path === 'string'));
}
