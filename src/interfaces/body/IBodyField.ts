import type { IBodyFieldOption } from '@interfaces/body/IBodyFieldOption';
import type { IObjectBodyFieldOption } from '@interfaces/body/IObjectBodyFieldOption';

export interface IBodyField {
  key: string;
  option: IBodyFieldOption | IObjectBodyFieldOption;
}
