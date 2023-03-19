/**
 * Utility Type for JinFrame. ConstructorType help to create constructor parameter.
 * This tips from [This article](https://stackoverflow.com/questions/55479658/how-to-create-a-type-excluding-instance-methods-from-a-class-in-typescript) and
 * [TypeScript: Create a condition-based subset types - DailyJS](https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c)
 */
import type AbstractJinFrame from '#frames/AbstractJinFrame';
import type ConstructorType from '#tools/type-utilities/ConstructorType';
import type JinBuiltInMember from '#tools/type-utilities/JinBuiltInMember';
import type { AxiosRequestConfig, Method } from 'axios';

export type JinConstructorType<T extends AbstractJinFrame> = Omit<ConstructorType<T>, JinBuiltInMember> & {
  $$host?: string;
  $$path?: string;
  $$method?: Method;
  $$contentType?: string;
  $$customBody?: unknown;
  $$transformRequest?: AxiosRequestConfig['transformRequest'];
};
