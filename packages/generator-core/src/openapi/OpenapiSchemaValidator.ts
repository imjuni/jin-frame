import OpenapiSchemaValidatorModule from "openapi-schema-validator";

export const OpenapiSchemaValidator =
  (OpenapiSchemaValidatorModule as unknown as { default?: typeof OpenapiSchemaValidatorModule }).default ??
  OpenapiSchemaValidatorModule;
