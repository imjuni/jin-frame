import type { ConstructorFunction } from "#tools/type-utilities/ConstructorFunction";
import type { PublicFieldsOf } from "#tools/type-utilities/PublicFieldsOf";

// Empty object assignability distinguishes optional keys from required keys.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T];

/**
 * Tracks explicitly assigned fields. Only required public fields gate build().
 * For compatibility, auto() marks all fields as assigned and from() tracks all
 * input keys, including optional keys. These paths do not prove runtime presence.
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
  build: [RequiredKeys<PublicFieldsOf<InstanceType<C>>>] extends [TSet] ? () => InstanceType<C> : never;
}
