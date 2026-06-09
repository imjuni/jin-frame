export interface ISecurityProviderReference {
  schemeName: string;
  className: string;
  importPath?: string;
  filePath: string;
  tag: string;
  generated: boolean;
}
