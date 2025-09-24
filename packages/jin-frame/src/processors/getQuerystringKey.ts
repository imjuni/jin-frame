import type { IQueryFieldOption } from '#interfaces/field/IQueryFieldOption';

export function getQuerystringKey({
  key,
  index,
  format,
}: {
  key: string;
  index: number;
  format?: IQueryFieldOption['keyFormat'];
}): string {
  if (format === 'brackets') {
    return `${key}[]`;
  }

  if (format === 'indices') {
    return `${key}[${index}]`;
  }

  if (format === 'one-indices') {
    return `${key}[${index + 1}]`;
  }

  return key;
}
