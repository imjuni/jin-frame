import type { TFieldsOf } from '#tools/type-utilities/TFieldsOf';
import type { TConstructorFunction } from '#tools/type-utilities/TConstructorFunction';

export interface TBuilderFor<T, C extends TConstructorFunction<T>> {
  set: <K extends keyof TFieldsOf<InstanceType<C>>>(k: K, v: TFieldsOf<InstanceType<C>>[K]) => TBuilderFor<T, C>;
  from: (v: {
    [K in keyof TFieldsOf<InstanceType<C>>]?: TFieldsOf<InstanceType<C>>[K];
  }) => TBuilderFor<T, C>;
  auto: () => TBuilderFor<T, C>;
  get: () => Readonly<Partial<TFieldsOf<InstanceType<C>>>>;
}
