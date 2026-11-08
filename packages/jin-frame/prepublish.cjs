const { readFileSync, writeFileSync } = require("node:fs");
const { resolve } = require("node:path");

const RELEASE_MODE = process.env.RELEASE_MODE === "true";

if (RELEASE_MODE === false) {
  console.log("Run `npm run release` to publish the package");
  process.exit(1); // which terminates the publish process
}

// Keep the repository README aligned with the package documentation before publishing.
const packageReadme = resolve(__dirname, "README.md");
const repositoryReadme = resolve(__dirname, "../../README.md");

const content = readFileSync(packageReadme, "utf8").replace("(../../LICENSE)", "(./LICENSE)");

writeFileSync(repositoryReadme, content);
