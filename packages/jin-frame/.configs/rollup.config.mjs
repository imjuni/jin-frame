import { isBuiltin } from "node:module";
import { resolve } from "node:path";
import { dts } from "rollup-plugin-dts";

export default {
  external: isBuiltin,
  input: "dist/types/origin/index.d.ts",
  output: [{ file: "dist/types/index.d.ts", format: "esm" }],
  plugins: [
    {
      name: "internal-declaration-paths",
      resolveId(source) {
        if (!source.startsWith("#")) {
          return null;
        }
        // Resolve internal imports to emitted declarations instead of source files.
        return resolve("dist/types/origin", `${source.slice(1)}.d.ts`);
      },
    },
    dts({ tsconfig: "./tsconfig.dts.json" }),
  ],
};
