import type { FlagExcludedType } from "#tools/type-utilities/FlagExcludedType";

export type AllowedNames<Base, Type> = FlagExcludedType<Base, Type>[keyof Base];
