import { IBodyFieldOption } from '@interfaces/body/IBodyFieldOption';
import { IObjectBodyFieldOption } from '@interfaces/body/IObjectBodyFieldOption';

export interface IBodyField {
  key: string;
  option: IBodyFieldOption | IObjectBodyFieldOption;
}
