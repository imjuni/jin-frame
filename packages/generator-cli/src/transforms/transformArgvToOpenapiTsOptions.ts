import type { TCreateCommandArgv } from '#/interfaces/ICreateCommandArgv';
import type { OpenAPITSOptions } from 'openapi-typescript';

export function transformArgvToOpenapiTsOptions(argv: TCreateCommandArgv): OpenAPITSOptions {
  return {
    // Boolean options - map from oat* prefixed properties to openapi-typescript options
    additionalProperties: argv.oatAdditionalProperties,
    alphabetize: argv.oatAlphabetize,
    arrayLength: argv.oatArrayLength,
    defaultNonNullable: argv.oatDefaultNonNullable,
    propertiesRequiredByDefault: argv.oatPropertiesRequiredByDefault,
    emptyObjectsUnknown: argv.oatEmptyObjectsUnknown,
    enum: argv.oatEnum,
    enumValues: argv.oatEnumValues,
    dedupeEnums: argv.oatDedupeEnums,
    excludeDeprecated: argv.oatExcludeDeprecated,
    exportType: argv.oatExportType,
    immutable: argv.oatImmutable,
    rootTypes: argv.oatRootTypes,
    rootTypesNoSchemaPrefix: argv.oatRootTypesNoSchemaPrefix,
    makePathsEnum: argv.oatMakePathsEnum,
    generatePathParams: argv.oatGeneratePathParams,

    // Additional options for better integration
    silent: false, // We want to see openapi-typescript logs
    version: 3, // Force OpenAPI 3.x version
  };
}
