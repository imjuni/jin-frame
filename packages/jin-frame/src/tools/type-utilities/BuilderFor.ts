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
 *
 * ---
 *
 * JinFrame 인스턴스를 생성하기 위한 빌더 인터페이스로, 컴파일 타임 필드 추적을 제공합니다.
 *
 * `TSet`은 `set()` 또는 `from()`으로 명시적으로 제공된 필드 키의 유니온을 누적합니다.
 * `build()`는 `TSet`이 모든 공개 필드 키를 포함할 때만 호출 가능하여,
 * 인스턴스 생성 전에 모든 필드가 할당되었음을 타입 수준에서 강제합니다.
 *
 * **`getDefaultValues()`와의 알려진 DX 한계**
 *
 * `getDefaultValues()`로 제공되는 필드는 빌더에서 명시적 설정 없이도 `build()`를
 * 호출할 수 있도록 optional(`field?: T`)로 선언해야 합니다.
 * 그 결과 해당 필드의 접근 타입이 `T | undefined`로 넓혀지므로, 런타임에 값이 항상
 * 존재함에도 불구하고 null 체크가 필요해지는 DX 저하가 발생합니다.
 * 완전한 해결을 위해서는 `getDefaultValues()`가 커버하는 필드를 타입 시스템이
 * 추론해야 하며, 현재는 `AbstractJinFrame` 수정 없이는 불가능합니다.
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
  //
  // 튜플 비교 [keyof ...] extends [TSet]는 의도된 패턴입니다. 단순 `A extends B`는
  // 유니온에 대해 분산되어 부분 일치를 허용하므로, 튜플로 감싸 전체 검사를 강제합니다.
  // TSet이 모든 공개 필드 키를 포함할 때만 build()가 호출 가능해집니다.
  build: [keyof PublicFieldsOf<InstanceType<C>>] extends [TSet] ? () => InstanceType<C> : never;
}
