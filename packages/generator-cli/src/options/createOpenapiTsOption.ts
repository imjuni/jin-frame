import type { createCommand } from '#/commands/createCommand';
import type { InferValue } from '@optique/core';
import type { OpenAPITSOptions } from 'openapi-typescript';

export function createOpenapiTsOption(params: InferValue<typeof createCommand>): OpenAPITSOptions {
  return {
    additionalProperties: params['oat-additional-properties'],
    alphabetize: params['oat-alphabetize'],
    arrayLength: params['oat-array-length'],
    defaultNonNullable: params['oat-default-non-nullable'],
    propertiesRequiredByDefault: params['oat-properties-required-by-default'],
    emptyObjectsUnknown: params['oat-empty-objects-unknown'],
    enum: params['oat-enum'],
    enumValues: params['oat-enum-values'],
    dedupeEnums: params['oat-dedupe-enums'],
    excludeDeprecated: params['oat-exclude-deprecated'],
    exportType: params['oat-export-type'],
    immutable: params['oat-immutable'],
    pathParamsAsTypes: params['oat-path-params-as-types'],
    rootTypes: params['oat-root-types'],
    rootTypesNoSchemaPrefix: params['oat-root-types-no-schema-prefix'],
    makePathsEnum: params['oat-make-paths-enum'],
    generatePathParams: params['oat-generate-path-params'],
  };
}
