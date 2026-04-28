import type { PublicFieldsOf } from '#tools/type-utilities/FieldsOf';
import type { ConstructorFunction } from '#tools/type-utilities/ConstructorFunction';

/**
 * Builder interface for constructing JinFrame instances with compile-time field tracking.
 *
 * `TSet` accumulates the union of field keys explicitly provided via `set()` or `from()`.
 * `build()` is only callable when `TSet` covers every public field key, enforcing that
 * all fields are assigned before the instance is created.
 *
 * **Known DX limitation with `getDefaultValues()`**
 *
 * Fields supplied by `getDefaultValues()` must be declared optional (`field?: T`) so that
 * `build()` does not require them to be explicitly set through the builder.
 * The trade-off is that TypeScript then widens their access type to `T | undefined`,
 * requiring null checks even though the value is always present at runtime.
 * Fully resolving this would require the type system to infer which fields are covered by
 * `getDefaultValues()` — currently not achievable without modifying `AbstractJinFrame`.
 */
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
  // Tuple comparison [keyof ...] extends [TSet] is intentional: a plain `A extends B`
  // distributes over unions, which would allow partial matches. Wrapping in a tuple
  // forces a holistic check — build() becomes callable only when TSet contains every
  // public field key.
  build: [keyof PublicFieldsOf<InstanceType<C>>] extends [TSet] ? () => InstanceType<C> : never;
}
