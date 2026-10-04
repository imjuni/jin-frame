import type { ISecurityProviderOverride } from "#generators/security/interfaces/ISecurityProviderOverride.js";

export interface ISecurityProviderOptions {
  securityProviderDir?: string;
  securityProviders?: Record<string, ISecurityProviderOverride>;
}
