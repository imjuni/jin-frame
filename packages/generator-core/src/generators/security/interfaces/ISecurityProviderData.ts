export interface ISecurityProviderData {
  schemeName: string;
  className: string;
  filePath: string;
  tag: string;
  builtinClassName: "ApiKeyProvider" | "BasicAuthProvider" | "BearerTokenProvider";
  constructorArguments: string[];
}
