/* eslint-disable n/no-sync */
import { existsSync, isDirectorySync } from 'my-node-fp';

export function getCoercePath({ kind, name }: { kind: 'file' | 'directory'; name: string }): (value: string) => string {
  const coercePath = (value: string) => {
    const isExists = existsSync(value);

    if (!isExists) {
      throw new Error(
        [name, `  - Invalid File path: ${value}`, '  - Must be a valid file path that exists'].join('\n'),
      );
    }

    if (kind === 'directory') {
      const isDirectory = isDirectorySync(value);
      if (!isDirectory) {
        throw new Error(
          [name, `  - Invalid Directory path: ${value}`, `  - Must be a valid directory path that exists`].join('\n'),
        );
      }

      return value;
    }

    return value;
  };

  return coercePath;
}
