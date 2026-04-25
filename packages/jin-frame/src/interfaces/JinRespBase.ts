export interface JinRespBase {
  status: number;
  statusText: string;
  headers: Record<string, string>;

  /**
   * Original fetch Response object. Stream may already be consumed,
   * but object is preserved for metadata access.
   */
  raw: Response;
}
