import type { IResponseContentType } from "#generators/content-type/interfaces/IResponseContentType.js";

export interface IResponseContentTypes {
  success?: IResponseContentType;
  fail?: IResponseContentType;
}
