import { pascalCase, snakeCase } from "change-case";
import type { IGetFrameNameProps } from "#generators/interfaces/IGetFrameNameProps.js";

export function getFrameName(params: IGetFrameNameProps): string {
  if (params.operationId != null) {
    return pascalCase(`${params.operationId}_Frame`);
  }

  const frame = pascalCase(snakeCase(`${params.method}_${params.pathKey.replace("/", "_")}_frame`));
  return frame;
}
