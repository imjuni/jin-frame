import { message, type ValueParserResult } from '@optique/core';
import { existsSync } from 'my-node-fp';
import { safeUrl } from '#/modules/safe-tools/safeUrl';

export function urlOrPathParser(value: string): ValueParserResult<string | URL> {
  // eslint-disable-next-line n/no-sync
  const isFile = existsSync(value);

  if (isFile) {
    return {
      value,
      success: true,
    };
  }

  const url = safeUrl(value);

  if (url == null) {
    return {
      error: message`Invalid File path or URL: ${value}`,
      success: false,
    };
  }

  return {
    value: new URL(value),
    success: true,
  };
}
