import { expectTypeOf, it } from "vitest";
import type { ICreateOpenapiTsOptions } from "#openapi/interfaces/ICreateOpenapiTsOptions.js";

it("should accept the int64 string option", () => {
  expectTypeOf<{ int64AsString: true; silent: true }>().toExtend<ICreateOpenapiTsOptions>();
});
