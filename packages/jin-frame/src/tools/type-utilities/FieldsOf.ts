import type { NonFunctionProps } from "#tools/type-utilities/NonFunctionProps";

// Readonly view of all data properties (methods excluded).
export type FieldsOf<T> = Readonly<NonFunctionProps<T>>;
