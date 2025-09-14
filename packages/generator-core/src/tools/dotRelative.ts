import pathe from 'pathe';

export function dotRelative(from: string, to: string): string {
  const relative = pathe.relative(from, to);
  return relative.startsWith('.') ? relative : `.${pathe.posix.sep}${relative}`;
}
