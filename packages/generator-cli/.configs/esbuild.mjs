import fs from "node:fs";
import * as esbuild from "esbuild";

const packageJson = JSON.parse((await fs.promises.readFile("package.json")).toString());

await esbuild.build({
  entryPoints: ["src/cli.ts"],
  bundle: true,
  sourcemap: true,
  outfile: "dist/cli.mjs",
  format: "esm",
  platform: "node",
  target: "node22",
  banner: {
    js: "#!/usr/bin/env node\n",
  },
  external: [...Object.keys(packageJson.dependencies), ...Object.keys(packageJson.peerDependencies)],
});
