export interface IGetMethodDecoratorProps {
  method: string;
  contentType?: string;
  host: string | (() => string);
  hostCode?: string;
  hostOverride?: string;
  path: string;
  baseFrame?: string;
  securityProviderClassNames?: string[];
}
