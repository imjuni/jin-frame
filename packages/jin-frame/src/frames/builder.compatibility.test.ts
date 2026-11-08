import { expect, it } from "vitest";
import { Get } from "#decorators/methods/Get";
import { JinFrame } from "#frames/JinFrame";

@Get({ host: "https://example.com" })
class Frame extends JinFrame {
  declare readonly id: string;
  declare readonly expand?: string;
}
class TenantFrame extends Frame {
  private readonly tenant: string;
  constructor(tenant: string) {
    super();
    this.tenant = tenant;
  }
  getTenant() {
    return this.tenant;
  }
}
it("should preserve types when optional fields are omitted", () => {
  const check = () => {
    Frame.builder().set("id", "123").build();
    // @ts-expect-error Required fields must be supplied.
    Frame.builder().build();
    // @ts-expect-error Field types must match.
    Frame.builder().set("id", 123);
    // @ts-expect-error Constructor argument types must match.
    TenantFrame.builder(123);
  };
  expect(check).toBeTypeOf("function");
  expect(TenantFrame.builder("acme").set("id", "123").build().getTenant()).toBe("acme");
  expect(TenantFrame.of({ id: "123" }, "acme").getTenant()).toBe("acme");
});
it("should preserve permissive paths and live views when using existing APIs", () => {
  expect(Frame.builder().auto().build().id).toBeUndefined();
  const partial: Partial<{ id: string }> = {};
  expect(Frame.builder().from(partial).build().id).toBeUndefined();
  expect(Frame.of(() => {}).id).toBeUndefined();
  const builder = Frame.builder().set("id", "first");
  const view = builder.get();
  builder.set("id", "second");
  expect(view.id).toBe("second");
});
