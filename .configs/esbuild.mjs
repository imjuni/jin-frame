import * as esbuild from 'esbuild'

if (process.env.FORMAT !== 'cjs' && process.env.FORMAT !== 'esm') {
  console.log(`support "cjs" or "esm"`);
  console.log(`eg. FORMAT=cjs node esbuild.mjs`);

  process.exit(1)
}

console.log(`esbuild: ${process.env.FORMAT}`)

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  sourcemap: true,
  // minify: true,
  outfile: process.env.FORMAT === 'cjs' ? 'dist/cjs/index.cjs' : 'dist/esm/index.mjs',
  format: process.env.FORMAT,
  external: [
    "axios",
    "fast-safe-stringify",
    "form-data",
    "http-status-codes",
    "merge",
    "my-easy-fp",
    "my-only-either",
    "path-to-regexp",
    "reflect-metadata",
    "type-fest",
  ],
})