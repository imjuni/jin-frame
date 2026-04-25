export interface JinRespBase {
  status: number;
  statusText: string;
  headers: Record<string, string>;
}
