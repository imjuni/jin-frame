import { nodeResolve } from '@rollup/plugin-node-resolve';
import readPackage from 'read-pkg';
import ts from 'rollup-plugin-ts';

const pkg = readPackage.sync();

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        format: 'cjs',
        file: 'dist/cjs/index.js',
        sourcemap: true,
      },
      {
        format: 'esm',
        file: 'dist/esm/index.js',
        sourcemap: true,
      },
    ],
    plugins: [
      nodeResolve({
        resolveOnly: (module) => {
          const isLocal =
            (pkg?.dependencies?.[module] === undefined || pkg?.dependencies?.[module] === null) &&
            (pkg?.devDependencies?.[module] === undefined || pkg?.devDependencies?.[module] === null);

          if (module === 'date-fns') {
            return true;
          }

          return isLocal;
        },
      }),
      ts({ tsconfig: 'tsconfig.prod.json' }),
    ],
  },
];
