import { safeUrl } from '@jin-frame/generator-core';
import { existsSync } from 'my-node-fp';

export function coercePathOrUrl(value: string): string {
  // eslint-disable-next-line n/no-sync
  const isFile = existsSync(value);

  if (isFile) {
    return value;
  }

  const url = safeUrl(value);

  if (url == null) {
    throw new Error(
      [
        '<spec>',
        `  - Invalid File path or URL: ${value}`,
        '  - Must be a valid file path that exists or a valid URL',
      ].join('\n'),
    );
  }

  return value;
}
