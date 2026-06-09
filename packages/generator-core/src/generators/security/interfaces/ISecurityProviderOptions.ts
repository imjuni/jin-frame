export interface ISecurityProviderOverride {
  className: string;
  importPath: string;
}

export interface ISecurityProviderOptions {
  securityProviderDir?: string;
  securityProviders?: Record<string, ISecurityProviderOverride>;
}
