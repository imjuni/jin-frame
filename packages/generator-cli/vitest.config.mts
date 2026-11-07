import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    testTimeout: 10_000,
    coverage: {
      provider: "v8", // or 'v8'
      include: ["src/**/*.ts"],
      thresholds: { lines: 90, statements: 90, functions: 90, branches: 90 },
      exclude: ["src/**/*.test.ts", "src/**/*.d.ts"],
    },
    exclude: ["node_modules", "examples"],
  },
});
