import type { TCreateCommandArgv } from "#interfaces/ICreateCommandArgv.js";

interface TOpenAPITSOptions {
  additionalProperties?: boolean;
  alphabetize?: boolean;
  arrayLength?: boolean;
  defaultNonNullable?: boolean;
  propertiesRequiredByDefault?: boolean;
  emptyObjectsUnknown?: boolean;
  enum?: boolean;
  enumValues?: boolean;
  dedupeEnums?: boolean;
  excludeDeprecated?: boolean;
  exportType?: boolean;
  immutable?: boolean;
  rootTypes?: boolean;
  rootTypesNoSchemaPrefix?: boolean;
  makePathsEnum?: boolean;
  generatePathParams?: boolean;
  int64AsString?: boolean;
  silent?: boolean;
  version?: number;
}

export function transformArgvToOpenapiTsOptions(argv: TCreateCommandArgv): TOpenAPITSOptions {
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
    int64AsString: argv.int64AsString,

    // Additional options for better integration
    silent: false, // We want to see openapi-typescript logs
    version: 3, // Force OpenAPI 3.x version
  };
}
