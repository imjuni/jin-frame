/**
 * Utility Type for JinFrame. ConstructorType help to create constructor parameter.
 * This tips from [This article](https://stackoverflow.com/questions/55479658/how-to-create-a-type-excluding-instance-methods-from-a-class-in-typescript) and
 * [TypeScript: Create a condition-based subset types - DailyJS](https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c)
 */
import type AbstractJinFrame from '#frames/AbstractJinFrame';

type JinBuiltInMember =
  | Extract<
      keyof AbstractJinFrame,
      | '$$query'
      | '$$header'
      | '$$param'
      | '$$body'
      | '$$host'
      | '$$path'
      | '$$method'
      | '$$contentType'
      | '$$customBody'
      | '$$transformRequest'
    >
  | '$$preHook'
  | '$$postHook';

export default JinBuiltInMember;
