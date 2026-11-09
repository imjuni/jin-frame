export interface BufferedResponse {
  status: number;
  statusText: string;
  headers: Headers;
  body: ArrayBuffer;
}
