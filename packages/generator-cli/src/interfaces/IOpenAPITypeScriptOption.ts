/**
 * Options passed to openapi-typescript CLI for type generation
 * Cannot support pathParamsAsTypes.
 *
 * @see https://openapi-ts.dev/cli#flags
 */
export interface IOpenAPITypeScriptOption {
  /** Allow arbitrary properties for all schema objects without additionalProperties: false (--additional-properties) */
  oatAdditionalProperties: boolean;

  /** Sort types alphabetically (--alphabetize) */
  oatAlphabetize: boolean;

  /** Generate tuples using array minItems / maxItems (--array-length) */
  oatArrayLength: boolean;

  /** Treat schema objects with default values as non-nullable (with the exception of parameters) (--default-non-nullable) */
  oatDefaultNonNullable: boolean;

  /** Treat schema objects without required as having all properties required (--properties-required-by-default) */
  oatPropertiesRequiredByDefault: boolean;

  /** Allow arbitrary properties for schema objects with no specified properties, and no specified additionalProperties (--empty-objects-unknown) */
  oatEmptyObjectsUnknown: boolean;

  /** Generate true TS enums rather than string unions (--enum) */
  oatEnum: boolean;

  /** Export enum values as arrays (--enum-values) */
  oatEnumValues: boolean;

  /** Dedupe enum types when --enum=true is set (--dedupe-enums) */
  oatDedupeEnums: boolean;

  /** Check that the generated types are up-to-date (--check) */
  oatCheck: boolean;

  /** Exclude deprecated fields from types (--exclude-deprecated) */
  oatExcludeDeprecated: boolean;

  /** Export type instead of interface (--export-type) */
  oatExportType: boolean;

  /** Generates immutable types (readonly properties and readonly array) (--immutable) */
  oatImmutable: boolean;

  /** Exports types from components as root level type aliases (--root-types) */
  oatRootTypes: boolean;

  /** Do not add "Schema" prefix to types at the root level (should only be used with --root-types) (--root-types-no-schema-prefix) */
  oatRootTypesNoSchemaPrefix: boolean;

  /** Generate ApiPaths enum for all paths (--make-paths-enum) */
  oatMakePathsEnum: boolean;

  /** Generate path parameters for all paths where they are undefined by schema (--generate-path-params) */
  oatGeneratePathParams: boolean;
}
