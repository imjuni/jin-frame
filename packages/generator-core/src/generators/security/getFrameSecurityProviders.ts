import type { OpenAPIV3 } from "openapi-types";
import type { ISecurityProviderReference } from "#generators/security/interfaces/ISecurityProviderReference.js";

export function getFrameSecurityProviders(
  operationSecurity: OpenAPIV3.SecurityRequirementObject[] | undefined,
  rootSecurity: OpenAPIV3.SecurityRequirementObject[] | undefined,
  references: Map<string, ISecurityProviderReference>,
): ISecurityProviderReference[] {
  const security = operationSecurity ?? rootSecurity;

  if (security == null || security.length === 0) {
    return [];
  }

  for (const requirement of security) {
    const providers = Object.keys(requirement).map((schemeName) => references.get(schemeName));

    if (providers.length > 0 && providers.every((provider) => provider != null)) {
      return providers;
    }
  }

  return [];
}
