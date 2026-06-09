import { pascalCase } from "change-case";
import type { OpenAPIV3 } from "openapi-types";
import type { ISecurityProviderData } from "#generators/security/interfaces/ISecurityProviderData.js";
import type {
  ISecurityProviderOptions,
  ISecurityProviderOverride,
} from "#generators/security/interfaces/ISecurityProviderOptions.js";
import type { ISecurityProviderReference } from "#generators/security/interfaces/ISecurityProviderReference.js";

const defaultSecurityProviderDir = "securities";
const builtinProviderClassNames = new Set(["ApiKeyProvider", "BasicAuthProvider", "BearerTokenProvider"]);

function quote(value: string): string {
  return JSON.stringify(value);
}

function getDefaultProviderClassName(schemeName: string): string {
  const className = pascalCase(`${schemeName} provider`);

  if (builtinProviderClassNames.has(className)) {
    return pascalCase(`${schemeName} security provider`);
  }

  return className;
}

function getProviderReference(
  schemeName: string,
  options?: ISecurityProviderOptions,
): ISecurityProviderReference | undefined {
  const override: ISecurityProviderOverride | undefined = options?.securityProviders?.[schemeName];
  const tag = options?.securityProviderDir ?? defaultSecurityProviderDir;
  const className = override?.className ?? getDefaultProviderClassName(schemeName);

  if (override != null) {
    return {
      schemeName,
      className,
      importPath: override.importPath,
      filePath: `${className}.ts`,
      tag,
      generated: false,
    };
  }

  return {
    schemeName,
    className,
    filePath: `${className}.ts`,
    tag,
    generated: true,
  };
}

function createGeneratedProviderData(
  schemeName: string,
  scheme: OpenAPIV3.SecuritySchemeObject,
  reference: ISecurityProviderReference,
): ISecurityProviderData | undefined {
  if (scheme.type === "apiKey") {
    return {
      schemeName,
      className: reference.className,
      filePath: reference.filePath,
      tag: reference.tag,
      builtinClassName: "ApiKeyProvider",
      constructorArguments: [quote(schemeName), quote(scheme.name), quote(scheme.in)],
    };
  }

  if (scheme.type !== "http") {
    return undefined;
  }

  if (scheme.scheme.toLowerCase() === "bearer") {
    return {
      schemeName,
      className: reference.className,
      filePath: reference.filePath,
      tag: reference.tag,
      builtinClassName: "BearerTokenProvider",
      constructorArguments: [quote(schemeName)],
    };
  }

  if (scheme.scheme.toLowerCase() === "basic") {
    return {
      schemeName,
      className: reference.className,
      filePath: reference.filePath,
      tag: reference.tag,
      builtinClassName: "BasicAuthProvider",
      constructorArguments: [quote(schemeName)],
    };
  }

  return undefined;
}

export function createSecurityProviderData(
  document: OpenAPIV3.Document,
  options?: ISecurityProviderOptions,
): { providers: ISecurityProviderData[]; references: Map<string, ISecurityProviderReference> } {
  const securitySchemes = document.components?.securitySchemes ?? {};
  const providers: ISecurityProviderData[] = [];
  const references = new Map<string, ISecurityProviderReference>();

  for (const [schemeName, scheme] of Object.entries(securitySchemes)) {
    if ("$ref" in scheme) {
      continue;
    }

    const reference = getProviderReference(schemeName, options);

    if (reference == null) {
      continue;
    }

    const generatedProvider =
      reference.generated === true ? createGeneratedProviderData(schemeName, scheme, reference) : undefined;

    if (reference.generated === true && generatedProvider == null) {
      continue;
    }

    references.set(schemeName, reference);

    if (generatedProvider != null) {
      providers.push(generatedProvider);
    }
  }

  return { providers, references };
}
