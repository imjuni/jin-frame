import { defaultSecurityProviderDir } from "#generators/security/defaultSecurityProviderDir.js";
import { getDefaultProviderClassName } from "#generators/security/getDefaultProviderClassName.js";
import type { ISecurityProviderOptions } from "#generators/security/interfaces/ISecurityProviderOptions.js";
import type { ISecurityProviderReference } from "#generators/security/interfaces/ISecurityProviderReference.js";

export function getProviderReference(
  schemeName: string,
  options?: ISecurityProviderOptions,
): ISecurityProviderReference {
  const override = options?.securityProviders?.[schemeName];
  const tag = options?.securityProviderDir ?? defaultSecurityProviderDir;
  const className = override?.className ?? getDefaultProviderClassName(schemeName);
  return override == null
    ? { schemeName, className, filePath: `${className}.ts`, tag, generated: true }
    : { schemeName, className, importPath: override.importPath, filePath: `${className}.ts`, tag, generated: false };
}
