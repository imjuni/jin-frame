import { z } from "zod";

const kebabToCamelEntries = [
  ["oat-additional-properties", "oatAdditionalProperties"],
  ["oat-alphabetize", "oatAlphabetize"],
  ["oat-array-length", "oatArrayLength"],
  ["oat-default-non-nullable", "oatDefaultNonNullable"],
  ["oat-properties-required-by-default", "oatPropertiesRequiredByDefault"],
  ["oat-empty-objects-unknown", "oatEmptyObjectsUnknown"],
  ["oat-enum", "oatEnum"],
  ["oat-enum-values", "oatEnumValues"],
  ["oat-dedupe-enums", "oatDedupeEnums"],
  ["oat-check", "oatCheck"],
  ["oat-exclude-deprecated", "oatExcludeDeprecated"],
  ["oat-export-type", "oatExportType"],
  ["oat-immutable", "oatImmutable"],
  ["oat-root-types", "oatRootTypes"],
  ["oat-root-types-no-schema-prefix", "oatRootTypesNoSchemaPrefix"],
  ["oat-make-paths-enum", "oatMakePathsEnum"],
  ["oat-generate-path-params", "oatGeneratePathParams"],
] as const;

export const normalizeOpenAPITypeScriptOptionInput = (value: unknown) => {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return value;
  }

  const record = value as Record<string, unknown>;
  const normalized = { ...record };

  for (const [kebabKey, camelKey] of kebabToCamelEntries) {
    normalized[camelKey] = record[kebabKey] ?? record[camelKey];
  }

  return normalized;
};

export const openapiTypeScriptOptionSchema = z.object({
  oatAdditionalProperties: z.boolean().default(false),
  oatAlphabetize: z.boolean().default(false),
  oatArrayLength: z.boolean().default(false),
  oatDefaultNonNullable: z.boolean().default(true),
  oatPropertiesRequiredByDefault: z.boolean().default(false),
  oatEmptyObjectsUnknown: z.boolean().default(false),
  oatEnum: z.boolean().default(false),
  oatEnumValues: z.boolean().default(false),
  oatDedupeEnums: z.boolean().default(false),
  oatCheck: z.boolean().default(false),
  oatExcludeDeprecated: z.boolean().default(false),
  oatExportType: z.boolean().default(false),
  oatImmutable: z.boolean().default(false),
  oatRootTypes: z.boolean().default(false),
  oatRootTypesNoSchemaPrefix: z.boolean().default(false),
  oatMakePathsEnum: z.boolean().default(false),
  oatGeneratePathParams: z.boolean().default(false),
});

export type TOpenAPITypeScriptOption = z.infer<typeof openapiTypeScriptOptionSchema>;
