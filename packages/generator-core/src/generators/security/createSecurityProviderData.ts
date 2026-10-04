import type { OpenAPIV3 } from "openapi-types";
import { createGeneratedProviderData } from "#generators/security/createGeneratedProviderData.js";
import { getProviderReference } from "#generators/security/getProviderReference.js";
import type { ISecurityProviderData } from "#generators/security/interfaces/ISecurityProviderData.js";
import type { ISecurityProviderOptions } from "#generators/security/interfaces/ISecurityProviderOptions.js";
import type { ISecurityProviderReference } from "#generators/security/interfaces/ISecurityProviderReference.js";

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
