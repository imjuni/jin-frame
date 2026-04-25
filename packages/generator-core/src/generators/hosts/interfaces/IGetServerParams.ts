import type { ILoadResult } from '#/openapi/interfaces/ILoadResult';
import type { OpenAPIV3 } from 'openapi-types';

export interface IGetServerParams {
  host?: string;
  specPath: { path: string; from: ILoadResult['from'] };
  document: OpenAPIV3.Document;
}
