import * as esbuild from 'esbuild';
import fs from 'fs';

if (process.env.FORMAT !== 'cjs' && process.env.FORMAT !== 'esm') {
  console.log(`support "cjs" or "esm"`);
  console.log(`eg. FORMAT=cjs node esbuild.mjs`);

  process.exit(1);
}

console.log(`esbuild: ${process.env.FORMAT}`);
const packageJson = JSON.parse((await fs.promises.readFile('package.json')).toString());

await esbuild.build({
  entryPoints: ['src/cli.ts'],
  bundle: true,
  sourcemap: true,
  outfile: process.env.FORMAT === 'cjs' ? 'dist/cjs/cli.cjs' : 'dist/esm/cli.mjs',
  format: process.env.FORMAT,
  platform: 'node',
  target: 'node20',
  external: [...Object.keys(packageJson.dependencies), ...Object.keys(packageJson.peerDependencies)],
});
