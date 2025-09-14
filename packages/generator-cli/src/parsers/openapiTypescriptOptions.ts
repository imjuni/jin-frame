import { object, optional, option } from '@optique/core';

export const openapiTypescriptOptions = object('openapi-typescript-options', {
  'oat-additional-properties': optional(option('--oat-additional-properties')),
  'oat-alphabetize': optional(option('--oat-alphabetize')),
  'oat-array-length': optional(option('--oat-array-length')),
  'oat-default-non-nullable': optional(option('--oat-default-non-nullable')),
  'oat-properties-required-by-default': optional(option('--oat-properties-required-by-default')),
  'oat-empty-objects-unknown': optional(option('--oat-empty-objects-unknown')),
  'oat-enum': optional(option('--oat-enum')),
  'oat-enum-values': optional(option('--oat-enum-values')),
  'oat-dedupe-enums': optional(option('--oat-dedupe-enums')),
  'oat-check': optional(option('--oat-check')),
  'oat-exclude-deprecated': optional(option('--oat-exclude-deprecated')),
  'oat-export-type': optional(option('--oat-export-type')),
  'oat-immutable': optional(option('--oat-immutable')),
  'oat-path-params-as-types': optional(option('--oat-path-params-as-types')),
  'oat-root-types': optional(option('--oat-root-types')),
  'oat-root-types-no-schema-prefix': optional(option('--oat-root-types-no-schema-prefix')),
  'oat-make-paths-enum': optional(option('--oat-make-paths-enum')),
  'oat-generate-path-params': optional(option('--oat-generate-path-params')),
});
