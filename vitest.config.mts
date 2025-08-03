import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8', // or 'v8'
      exclude: [
        '.eslintrc.cjs',
        'prepublish.cjs',
        '.configs/**',
        'dist',
        'examples',
        'vitest.config.mts',
        'src/interfaces',
        'src/tools/type-utilities',
      ],
    },
  },
  plugins: [tsconfigPaths({ projects: ['tsconfig.json'] })],
});
