import type { FieldsOf } from '#tools/type-utilities/FieldsOf';
import type { ConstructorFunction } from '#tools/type-utilities/ConstructorFunction';

export interface BuilderFor<T, C extends ConstructorFunction<T>> {
  set: <K extends keyof FieldsOf<InstanceType<C>>>(k: K, v: FieldsOf<InstanceType<C>>[K]) => BuilderFor<T, C>;
  from: (v: {
    [K in keyof FieldsOf<InstanceType<C>>]?: FieldsOf<InstanceType<C>>[K];
  }) => BuilderFor<T, C>;
  auto: () => BuilderFor<T, C>;
  get: () => Readonly<Partial<FieldsOf<InstanceType<C>>>>;
  build: () => InstanceType<C>;
}
