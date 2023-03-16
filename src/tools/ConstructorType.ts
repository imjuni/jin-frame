/**
 * Utility Type for JinFrame. ConstructorType help to create constructor parameter.
 * This tips from [This article](https://stackoverflow.com/questions/55479658/how-to-create-a-type-excluding-instance-methods-from-a-class-in-typescript) and
 * [TypeScript: Create a condition-based subset types - DailyJS](https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c)
 */

import type { AbstractJinFrame } from '#frames/AbstractJinFrame';

// 1 Transform the type to flag all the undesired keys as 'never'
type FlagExcludedType<Base, Type> = { [Key in keyof Base]: Base[Key] extends Type ? never : Key };

// 2 Get the keys that are not flagged as 'never'
type AllowedNames<Base, Type> = FlagExcludedType<Base, Type>[keyof Base];

// 3 Use this with a simple Pick to get the right interface, excluding the undesired type
type OmitType<Base, Type> = Pick<Base, AllowedNames<Base, Type>>;

// 4 Exclude the Function type to only get properties
export type ConstructorType<T> = OmitType<T, Function>;

export type OmitConstructorType<T, M extends keyof ConstructorType<T>> = Omit<ConstructorType<T>, M>;

export type JinBuiltInMember = Extract<
  keyof AbstractJinFrame,
  | 'host'
  | 'path'
  | 'method'
  | 'contentType'
  | 'customBody'
  | 'preHook'
  | 'postHook'
  | '$$query'
  | '$$header'
  | '$$param'
  | '$$body'
>;

export type JinConstructorType<T extends AbstractJinFrame> = Omit<ConstructorType<T>, JinBuiltInMember>;

export type JinOmitConstructorType<T extends AbstractJinFrame, M extends keyof ConstructorType<T>> = Omit<
  ConstructorType<T>,
  JinBuiltInMember | M
>;
