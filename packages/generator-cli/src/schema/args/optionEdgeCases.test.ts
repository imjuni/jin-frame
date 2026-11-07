import { expect, it } from "vitest";
import { coerceIdentifier } from "#validators/coerceIdentifier.js";
import { parseRetryOverride } from "#schema/args/parseRetryOverride.js";
import { generatorOptionSchema } from "#schema/args/generatorOptionSchema.js";
import { normalizeGeneratorOptionInput } from "#schema/args/normalizeGeneratorOptionInput.js";

it("should reject invalid class names when coercing base frame options", () => {
  expect(coerceIdentifier(false)).toBeUndefined();
  expect(coerceIdentifier("BaseFrame")).toBe("BaseFrame");
  expect(() => coerceIdentifier("invalid-name")).toThrow("valid TypeScript identifier");
  expect(() => coerceIdentifier("baseFrame")).toThrow("PascalCase");
});
it.each(["null", "[]", "42", '"retry"'])("should reject non object retry options when parsing %s", (value) => {
  expect(() => parseRetryOverride(value)).toThrow("JSON object");
});
it("should normalize server mappings when parsing CLI options", () => {
  const base = { spec: "spec.json", output: "output" };
  expect(
    generatorOptionSchema.parse({ ...base, serverMapping: '{"development":"https://dev.test"}' }).serverMapping,
  ).toEqual({ development: "https://dev.test" });
  expect(generatorOptionSchema.parse({ ...base, serverMapping: "" }).serverMapping).toBeUndefined();
  expect(generatorOptionSchema.safeParse({ ...base, serverMapping: "{" }).success).toBe(false);
  expect(
    generatorOptionSchema.parse({ ...base, serverMapping: { production: "https://prod.test" } }).serverMapping,
  ).toEqual({ production: "https://prod.test" });
});
it.each([null, undefined, 1, []])("should preserve unsupported inputs when normalizing %s", (value) => {
  expect(normalizeGeneratorOptionInput(value)).toBe(value);
});
