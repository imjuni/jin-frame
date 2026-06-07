import OpenapiSchemaValidator from "openapi-schema-validator";
import type { OpenAPIV2, OpenAPIV3 } from "openapi-types";
import type { TValidateResult } from "#/openapi/interfaces/TValidateResult";

export function validate(document: unknown): TValidateResult {
  const validators = {
    v2: new OpenapiSchemaValidator({ version: 2 }),
    v3: new OpenapiSchemaValidator({ version: 3 }),
  };

  const v2 = validators.v2.validate(document as Parameters<typeof validators.v2.validate>[0]);

  if (v2.errors.length <= 0) {
    return {
      valid: true,
      version: 2,
      document: document as OpenAPIV2.Document,
      errors: [],
    };
  }

  const v3 = validators.v3.validate(document as Parameters<typeof validators.v3.validate>[0]);

  if (v3.errors.length <= 0) {
    return {
      valid: true,
      version: 3,
      document: document as OpenAPIV3.Document,
      errors: [],
    };
  }

  return {
    valid: false,
    version: 2,
    document,
    errors: v3.errors,
  };
}
