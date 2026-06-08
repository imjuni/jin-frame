export interface IGetResponseTypeMappedAccessPathProps {
  pathKey: string;
  method: string;
  responseContentType: { statusCode: string; mediaType: string };
}
