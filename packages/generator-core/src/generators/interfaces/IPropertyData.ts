import type { IPropertyDecoratorData } from "#generators/interfaces/IPropertyDecoratorData.js";

export interface IPropertyData {
  decorators: IPropertyDecoratorData[];
  docs: string[];
  name: string;
  type?: string;
  hasDeclareKeyword: boolean;
  isReadonly: boolean;
  hasQuestionToken: boolean;
}
