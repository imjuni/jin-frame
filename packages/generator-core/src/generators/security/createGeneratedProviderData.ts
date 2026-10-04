import type { OpenAPIV3 } from "openapi-types";
import type { ISecurityProviderData } from "#generators/security/interfaces/ISecurityProviderData.js";
import type { ISecurityProviderReference } from "#generators/security/interfaces/ISecurityProviderReference.js";
import { quote } from "#generators/security/quote.js";

export function createGeneratedProviderData(
  schemeName: string,
  scheme: OpenAPIV3.SecuritySchemeObject,
  reference: ISecurityProviderReference,
): ISecurityProviderData | undefined {
  const base = { schemeName, className: reference.className, filePath: reference.filePath, tag: reference.tag };
  if (scheme.type === "apiKey")
    return {
      ...base,
      builtinClassName: "ApiKeyProvider",
      constructorArguments: [quote(schemeName), quote(scheme.name), quote(scheme.in)],
    };
  if (scheme.type !== "http") return undefined;
  if (scheme.scheme.toLowerCase() === "bearer")
    return { ...base, builtinClassName: "BearerTokenProvider", constructorArguments: [quote(schemeName)] };
  if (scheme.scheme.toLowerCase() === "basic")
    return { ...base, builtinClassName: "BasicAuthProvider", constructorArguments: [quote(schemeName)] };
  return undefined;
}
