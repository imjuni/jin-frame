module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:@typescript-eslint/strict',
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.eslint.json'],
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['coverage/**', 'examples/**', 'dist/**', '__test__/**', '__tests__/**'],
  plugins: ['@typescript-eslint', 'prettier', 'import'],
  rules: {
    'max-len': [
      'error',
      {
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreComments: true,
        ignoreTrailingComments: true,
        code: 120,
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        varsIgnorePattern: '^_.+$',
        argsIgnorePattern: '^_.+$',
        ignoreRestSiblings: true,
      },
    ],
    'import/extensions': ['off'],
    'import/prefer-default-export': 'off',
    // 'import/no-default-export': 'error',
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    // static function use this: void
    '@typescript-eslint/no-invalid-void-type': ['error', { allowAsThisParameter: true }],
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': ['off'],
  },
  overrides: [
    {
      files: ['**/scripts/*.js'],
      rules: {
        'no-console': ['off'],
      },
    },
    {
      files: ['src/frames/AbstractJinFrame.ts'],
      rules: {
        '@typescript-eslint/no-floating-promises': ['off'],
        '@typescript-eslint/no-unsafe-declaration-merging': ['off'],
      },
    },
    {
      files: ['src/frames/JinFrame.ts', 'src/frames/JinEitherFrame.ts'],
      rules: {
        '@typescript-eslint/no-invalid-void-type': ['off'],
        '@typescript-eslint/no-unsafe-declaration-merging': ['off'],
        'import/no-extraneous-dependencies': ['off'],
        'import/no-duplicates': ['off'],
      },
    },
    {
      files: ['**/__tests__/*.ts', 'jest.config.cjs'],
      rules: {
        'max-classes-per-file': ['off'],
        'class-methods-use-this': ['off'],
        '@typescript-eslint/no-explicit-any': ['off'],
        '@typescript-eslint/no-unsafe-return': ['off'],
        '@typescript-eslint/no-unsafe-assignment': ['off'],
        '@typescript-eslint/no-unsafe-argument': ['off'],
        '@typescript-eslint/no-unsafe-member-access': ['off'],
        'no-console': ['off'],
      },
    },
    {
      files: ['jest.config.cjs'],
      rules: {
        '@typescript-eslint/no-var-requires': ['off'],
        'import/no-extraneous-dependencies': ['off'],
      },
    },
    {
      files: [
        'src/frames/AbstractJinFrame.ts',
        'src/processors/getHeaderInfo.ts',
        'src/processors/processBodyFormatters.ts',
        'src/frames/JinEitherFrame.ts',
        'src/interfaces/TPassJinEitherFrame.ts',
        'src/interfaces/IFailJinEitherFrame.ts',
        'src/interfaces/TJinFrameResponse.ts',
        'src/frames/JinFrame.ts',
        'src/tools/formatters/applyFormatter.ts',
        'src/processors/getBodyInfo.ts',
      ],
      rules: {
        '@typescript-eslint/no-explicit-any': ['off'],
      },
    },
    {
      files: ['src/frames/JinFrame.ts', 'src/processors/processBodyFormatters.ts'],
      rules: {
        '@typescript-eslint/no-non-null-assertion': ['off'],
      },
    },
  ],
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: 'tsconfig.eslint.json',
      },
    },
  },
};
