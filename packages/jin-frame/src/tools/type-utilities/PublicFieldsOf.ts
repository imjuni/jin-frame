import type { NonFunctionProps } from "#tools/type-utilities/NonFunctionProps";

export type PublicFieldsOf<T> = {
  [K in keyof NonFunctionProps<T> as K extends `_${string}` ? never : K]: NonFunctionProps<T>[K];
};
