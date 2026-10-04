import type { AnyFn } from "#tools/type-utilities/AnyFn";

export type FunctionKeys<T> = { [K in keyof T]-?: Extract<T[K], AnyFn> extends never ? never : K }[keyof T];
