import { defineConfig } from "oxfmt";
import ultracite from "ultracite/oxfmt";

export default defineConfig({
  ...ultracite,
  ignorePatterns: [...ultracite.ignorePatterns, "**/*.md", "**/*.yml", "**/*.yaml"],
  printWidth: 120,
  sortImports: false,
  sortPackageJson: false,
  trailingComma: "all",
});
