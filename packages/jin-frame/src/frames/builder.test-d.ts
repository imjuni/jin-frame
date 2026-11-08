import { expectTypeOf, test } from "vitest";
import { JinFrame } from "#frames/JinFrame";

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
