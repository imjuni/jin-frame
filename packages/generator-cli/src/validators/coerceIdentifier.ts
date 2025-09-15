import { isIdentifierName } from '@babel/helper-validator-identifier';
import { pascalCase } from 'change-case';

export function coerceIdentifier(value: string | false): string | undefined {
  if (value === false) {
    return undefined;
  }

  const identifier = value;

  if (!isIdentifierName(identifier)) {
    throw new Error(
      [
        '--base-frame',
        `  - Invalid Identifier: ${value}`,
        '  - Must be a valid TypeScript identifier (e.g., BaseFrame, MyApiClient)',
      ].join('\n'),
    );
  }

  if (identifier !== pascalCase(identifier)) {
    throw new Error(
      [
        '--base-frame',
        `  - Invalid Identifier: ${value}`,
        '  - Must be a valid PascalCase identifier (e.g., BaseFrame, MyApiClient)',
      ].join('\n'),
    );
  }

  return value;
}
