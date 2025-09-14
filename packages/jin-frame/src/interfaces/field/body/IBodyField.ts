import type { IBodyFieldOption } from '#interfaces/field/body/IBodyFieldOption';
import type { IObjectBodyFieldOption } from '#interfaces/field/body/IObjectBodyFieldOption';

export interface IBodyField {
  key: string;
  option: IBodyFieldOption | IObjectBodyFieldOption;
}
