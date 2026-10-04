import type { FunctionKeys } from "#tools/type-utilities/FunctionKeys";

export type NonFunctionProps<T> = Omit<T, FunctionKeys<T>>;
