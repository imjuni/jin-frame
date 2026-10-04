export interface TOpenAPITSOptions {
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
