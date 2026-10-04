import { pascalCase } from "change-case";
import { builtinProviderClassNames } from "#generators/security/builtinProviderClassNames.js";

export function getDefaultProviderClassName(schemeName: string): string {
  const className = pascalCase(`${schemeName} provider`);
  return builtinProviderClassNames.has(className) ? pascalCase(`${schemeName} security provider`) : className;
}
