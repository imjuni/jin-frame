import pathe from 'pathe';

export function removeExt(filePath: string): string {
  if (filePath.endsWith('.d.ts')) {
    return filePath.slice(0, -5);
  }

  const ext = pathe.extname(filePath);
  return filePath.slice(0, -ext.length);
}
