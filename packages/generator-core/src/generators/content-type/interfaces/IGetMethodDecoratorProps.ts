export interface IGetMethodDecoratorProps {
  method: string;
  contentType?: string;
  host: string | (() => string);
  hostCode?: string;
  path: string;
  baseFrame?: string;
}
