import type { PublicFieldsOf } from '#tools/type-utilities/FieldsOf';
import type { ConstructorFunction } from '#tools/type-utilities/ConstructorFunction';

export interface BuilderFor<
  C extends ConstructorFunction<unknown>,
  TSet extends keyof PublicFieldsOf<InstanceType<C>> = never,
> {
  set: <K extends keyof PublicFieldsOf<InstanceType<C>>>(
    k: K,
    v: PublicFieldsOf<InstanceType<C>>[K],
  ) => BuilderFor<C, TSet | K>;
  from: <V extends Partial<PublicFieldsOf<InstanceType<C>>>>(
    v: V,
  ) => BuilderFor<C, TSet | (keyof V & keyof PublicFieldsOf<InstanceType<C>>)>;
  auto: () => BuilderFor<C, TSet | keyof PublicFieldsOf<InstanceType<C>>>;
  get: () => Readonly<Partial<PublicFieldsOf<InstanceType<C>>>>;
  build: [keyof PublicFieldsOf<InstanceType<C>>] extends [TSet] ? () => InstanceType<C> : never;
}
