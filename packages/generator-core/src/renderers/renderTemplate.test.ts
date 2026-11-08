import { transformSync } from "esbuild";
import { describe, expect, it } from "vitest";
import { renderDoc } from "#renderers/renderDoc.js";
import { renderSecurityProviderSource } from "#renderers/renderSecurityProviderSource.js";
import { renderTemplate } from "#renderers/renderTemplate.js";

describe("Eta code generation", () => {
  it("should preserve TypeScript expressions and Eta delimiters when rendering data", () => {
    const source = renderTemplate("type Value = <%~ it.value %>;", { value: 'Array<string> | "<%~ injected %>"' });
    expect(source).toBe('type Value = Array<string> | "<%~ injected %>";');
  });

  it("should escape a closing comment marker when generating documentation", () => {
    const source = `${renderDoc("Example */ unsafe")}\nexport class Example {}`;
    expect(source).toContain("Example * / unsafe");
    expect(() => transformSync(source, { loader: "ts" })).not.toThrow();
  });

  it("should generate parseable code when rendering a security provider", () => {
    const source = renderSecurityProviderSource({
      schemeName: "bearer",
      className: "AuthProvider",
      filePath: "AuthProvider.ts",
      tag: "security",
      builtinClassName: "BearerTokenProvider",
      constructorArguments: ["key", '"bearer"'],
    });
    expect(source).toContain('super(key, "bearer");');
    expect(() => transformSync(source, { loader: "ts" })).not.toThrow();
  });
});
