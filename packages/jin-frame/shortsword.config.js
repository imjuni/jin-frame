module.exports = {
  "max-statements": 1,
  "max-files": 15,
  "use-abs-path": true,
  exclude: [
    "**/*.test.ts",
    "**/*.spec.ts",
    "**/*.testcase.ts",
    "**/testcase/**",
    "**/testcases/**",
    "**/__tests__/**",
    "**/__test__/**",
  ],
  project: "./tsconfig.json",
};
