import { pascalCase, snakeCase } from 'change-case';
import type { THttpMethod } from '#/https/method';

interface IProps {
  pathKey: string;
  method: THttpMethod;
  operationId?: string;
}

export function getFrameName(params: IProps): string {
  if (params.operationId != null) {
    return pascalCase(`${params.operationId}_Frame`);
  }

  const frame = pascalCase(snakeCase(`${params.method}_${params.pathKey.replace('/', '_')}_frame`));
  return frame;
}
