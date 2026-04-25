import type { IGetServerParams } from '#/generators/hosts/interfaces/IGetServerParams';

export interface IGetBaseHostParams {
  host?: string;
  spec: IGetServerParams['specPath'];
}
