import fs from "node:fs";
import * as esbuild from "esbuild";

const packageJson = JSON.parse((await fs.promises.readFile("package.json")).toString());

await esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  loader: { ".eta": "text" },
  sourcemap: true,
  minify: true,
  outfile: "dist/esm/index.mjs",
  format: "esm",
  platform: "node",
  target: "node22",
  external: [...Object.keys(packageJson.dependencies), ...Object.keys(packageJson.peerDependencies)],
});
