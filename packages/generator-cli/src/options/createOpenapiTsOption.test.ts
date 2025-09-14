import { createOpenapiTsOption } from '#/modules/openapi-ts/createOpenapiTsOption';
import { describe, expect, it } from 'vitest';

describe('createOpenapiTsOption', () => {
  it('should transform kebab-case option keys to camelCase when creating openapi-ts options', () => {
    const result = createOpenapiTsOption({
      action: 'create',
      spec: 'spec',
      output: 'output',
      logLevel: 'info',
      host: 'host',
      codeFence: false,
      baseFrame: 'BaseFrame',
      timeout: 60000,

      'oat-additional-properties': undefined,
      'oat-alphabetize': undefined,
      'oat-array-length': undefined,
      'oat-default-non-nullable': undefined,
      'oat-properties-required-by-default': undefined,
      'oat-empty-objects-unknown': undefined,
      'oat-enum': undefined,
      'oat-enum-values': undefined,
      'oat-dedupe-enums': undefined,
      'oat-check': undefined,
      'oat-exclude-deprecated': undefined,
      'oat-export-type': undefined,
      'oat-immutable': undefined,
      'oat-path-params-as-types': undefined,
      'oat-root-types': undefined,
      'oat-root-types-no-schema-prefix': undefined,
      'oat-make-paths-enum': undefined,
      'oat-generate-path-params': undefined,
    });

    expect(result).toEqual({
      additionalProperties: undefined,
      alphabetize: undefined,
      arrayLength: undefined,
      defaultNonNullable: undefined,
      propertiesRequiredByDefault: undefined,
      emptyObjectsUnknown: undefined,
      enum: undefined,
      enumValues: undefined,
      dedupeEnums: undefined,
      excludeDeprecated: undefined,
      exportType: undefined,
      immutable: undefined,
      pathParamsAsTypes: undefined,
      rootTypes: undefined,
      rootTypesNoSchemaPrefix: undefined,
      makePathsEnum: undefined,
      generatePathParams: undefined,
    });
  });
});
