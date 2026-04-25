export interface JinRequestConfig {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: BodyInit;
  timeout?: number;
  signal?: AbortSignal;
}
