import ts from "typescript";
import { describe, expect, it } from "vitest";
import { renderDoc } from "#renderers/renderDoc.js";
import { renderSecurityProviderSource } from "#renderers/renderSecurityProviderSource.js";
import { renderTemplate } from "#renderers/renderTemplate.js";

describe("Eta code generation", () => {
  it("should preserve TypeScript expressions and Eta delimiters in data", () => {
    const source = renderTemplate("type Value = <%~ it.value %>;", { value: 'Array<string> | "<%~ injected %>"' });
    expect(source).toBe('type Value = Array<string> | "<%~ injected %>";');
  });

  it("should keep a closing comment marker inside generated documentation", () => {
    const source = `${renderDoc("Example */ unsafe")}\nexport class Example {}`;
    expect(source).toContain("Example * / unsafe");
    expect(
      ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.Latest }, reportDiagnostics: true })
        .diagnostics,
    ).toHaveLength(0);
  });

  it("should generate a parseable security provider", () => {
    const source = renderSecurityProviderSource({
      schemeName: "bearer",
      className: "AuthProvider",
      filePath: "AuthProvider.ts",
      tag: "security",
      builtinClassName: "BearerTokenProvider",
      constructorArguments: ['"bearer"'],
    });
    expect(source).toContain('super("bearer");');
    expect(
      ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.Latest }, reportDiagnostics: true })
        .diagnostics,
    ).toHaveLength(0);
  });
});
