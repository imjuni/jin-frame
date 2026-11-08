import { expectTypeOf, test } from "vitest";
import { JinFrame } from "#frames/JinFrame";
import type { PublicFieldsOf } from "#tools/type-utilities/PublicFieldsOf";

class RequiredFrame extends JinFrame {
  declare readonly id: string;
  declare readonly expand?: string;
}
class OptionalFrame extends JinFrame {
  declare readonly query?: string;
}
class UndefinedFrame extends JinFrame {
  declare readonly value: string | undefined;
}
class TenantFrame extends RequiredFrame {
  constructor(tenant: string, region?: string, ...tags: string[]) {
    super();
    void tenant;
    void region;
    void tags;
  }
}

test("should require only mandatory public keys when building frames", () => {
  expectTypeOf(RequiredFrame.builder().set("id", "123").build()).toEqualTypeOf<RequiredFrame>();
  expectTypeOf(OptionalFrame.builder().build()).toEqualTypeOf<OptionalFrame>();
  expectTypeOf(UndefinedFrame.builder().set("value", undefined).build()).toEqualTypeOf<UndefinedFrame>();
  // @ts-expect-error Required keys cannot be omitted.
  RequiredFrame.builder().build();
  // @ts-expect-error A required key remains required even if its value permits undefined.
  UndefinedFrame.builder().build();
  // @ts-expect-error Unknown keys cannot be assigned.
  RequiredFrame.builder().set("missing", "123");
  // @ts-expect-error Values must match the selected field.
  RequiredFrame.builder().set("id", 123);
});

test("should infer constructor arguments when creating inherited frames", () => {
  expectTypeOf(TenantFrame.builder("acme", undefined, "tag").set("id", "123").build()).toEqualTypeOf<TenantFrame>();
  expectTypeOf(TenantFrame.of({ id: "123" }, "acme")).toEqualTypeOf<TenantFrame>();
  expectTypeOf(TenantFrame.of((b) => b.set("id", "123"), "acme")).toEqualTypeOf<TenantFrame>();
  // @ts-expect-error The required constructor argument cannot be omitted.
  TenantFrame.builder();
  // @ts-expect-error Constructor argument types must match.
  TenantFrame.of({ id: "123" }, 123);
});

test("should retain permissive field tracking when using compatible paths", () => {
  const values: Partial<{ id: string }> = {};
  expectTypeOf(RequiredFrame.builder().from(values).build()).toEqualTypeOf<RequiredFrame>();
  expectTypeOf(RequiredFrame.builder().auto().build()).toEqualTypeOf<RequiredFrame>();
  expectTypeOf(RequiredFrame.of(() => {})).toEqualTypeOf<RequiredFrame>();
});

class EmptyFrame extends JinFrame {}

class EmptyTenantFrame extends JinFrame {
  constructor(tenant: string) {
    super();
    void tenant;
  }
}

test("should allow omitted fields only when no required public fields exist", () => {
  expectTypeOf(EmptyFrame.of()).toEqualTypeOf<EmptyFrame>();
  expectTypeOf(EmptyFrame.of(undefined)).toEqualTypeOf<EmptyFrame>();
  expectTypeOf(OptionalFrame.of()).toEqualTypeOf<OptionalFrame>();
  expectTypeOf(OptionalFrame.of(undefined)).toEqualTypeOf<OptionalFrame>();
  expectTypeOf(RequiredFrame.of({ id: "ironman" })).toEqualTypeOf<RequiredFrame>();
  expectTypeOf(EmptyTenantFrame.of(undefined, "acme")).toEqualTypeOf<EmptyTenantFrame>();
  // @ts-expect-error Required public fields cannot be omitted.
  RequiredFrame.of();
  // @ts-expect-error Undefined cannot replace required public fields.
  RequiredFrame.of(undefined);
  // @ts-expect-error Allowing undefined values does not make a field optional.
  UndefinedFrame.of();
  // @ts-expect-error Constructor arguments remain required.
  EmptyTenantFrame.of();
  // @ts-expect-error Constructor argument types remain checked.
  EmptyTenantFrame.of(undefined, 123);
});

class DefaultedFrame extends JinFrame {
  declare readonly page: number;

  protected static override getDefaultValues(): Partial<PublicFieldsOf<DefaultedFrame>> {
    return { page: 1 };
  }
}

test("should validate subclass defaults when the subclass type is explicit", () => {
  expectTypeOf(DefaultedFrame.builder().auto().build()).toEqualTypeOf<DefaultedFrame>();
  // @ts-expect-error Default field values must match the subclass field types.
  expectTypeOf({ page: "one" }).toExtend<Partial<PublicFieldsOf<DefaultedFrame>>>();
  // @ts-expect-error Defaults must not introduce unknown fields.
  const invalid: Partial<PublicFieldsOf<DefaultedFrame>> = { missing: true };
  expectTypeOf(invalid).toEqualTypeOf<Partial<PublicFieldsOf<DefaultedFrame>>>();
});
