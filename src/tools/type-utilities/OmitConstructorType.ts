/**
 * Utility Type for JinFrame. ConstructorType help to create constructor parameter.
 * This tips from [This article](https://stackoverflow.com/questions/55479658/how-to-create-a-type-excluding-instance-methods-from-a-class-in-typescript) and
 * [TypeScript: Create a condition-based subset types - DailyJS](https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c)
 */
import type { ConstructorType } from '#tools/type-utilities/ConstructorType';

export type OmitConstructorType<T, M extends keyof ConstructorType<T>> = Omit<ConstructorType<T>, M>;
