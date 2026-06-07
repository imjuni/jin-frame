import { z } from "zod";

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
