import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    testTimeout: 10_000,
    coverage: {
      provider: "v8", // or 'v8'
      all: false,
    },
    exclude: ["node_modules", "examples"],
  },
});
