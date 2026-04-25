import { randomUUID } from 'node:crypto';

export function randomFilename(_ext?: string): string {
  const ext = _ext ?? '.ts';
  return `${randomUUID()}-${randomUUID()}-${randomUUID()}${ext}`;
}
