// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...a: any[]) => unknown;

// Extracts all keys whose value type includes a function signature.
// Used to distinguish method members from plain data properties.
type FunctionKeys<T> = { [K in keyof T]-?: Extract<T[K], AnyFn> extends never ? never : K }[keyof T];

// Strips all method keys from T, leaving only data properties.
type NonFunctionProps<T> = Omit<T, FunctionKeys<T>>;

// Readonly view of all data properties (methods excluded).
export type FieldsOf<T> = Readonly<NonFunctionProps<T>>;

// Like FieldsOf but additionally strips keys prefixed with '_'.
// The '_' prefix is the project convention for internal/protected fields
// that should not be part of the public builder or of() API surface.
export type PublicFieldsOf<T> = {
  [K in keyof NonFunctionProps<T> as K extends `_${string}` ? never : K]: NonFunctionProps<T>[K];
};
