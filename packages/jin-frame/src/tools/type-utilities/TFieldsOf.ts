// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...a: any[]) => unknown;

type FunctionKeys<T> = { [K in keyof T]-?: Extract<T[K], AnyFn> extends never ? never : K }[keyof T];

type NonFunctionProps<T> = Omit<T, FunctionKeys<T>>;

export type TFieldsOf<T> = Readonly<NonFunctionProps<T>>;
