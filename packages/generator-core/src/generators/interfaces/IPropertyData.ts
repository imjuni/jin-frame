export interface IPropertyDecoratorData {
  name: string;
  arguments: string[];
}

export interface IPropertyData {
  decorators: IPropertyDecoratorData[];
  docs: string[];
  name: string;
  type?: string;
  hasDeclareKeyword: boolean;
  isReadonly: boolean;
  hasQuestionToken: boolean;
}
