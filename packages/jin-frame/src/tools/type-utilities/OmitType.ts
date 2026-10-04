import type { AllowedNames } from "#tools/type-utilities/AllowedNames";

export type OmitType<Base, Type> = Pick<Base, AllowedNames<Base, Type>>;
