import type { OpenAPISchemaValidatorResult } from "openapi-schema-validator";
import type { OpenAPIV2, OpenAPIV3 } from "openapi-types";

export type TValidateResult =
  | {
      valid: true;
      version: 2;
      document: OpenAPIV2.Document;
      errors: OpenAPISchemaValidatorResult["errors"];
    }
  | {
      valid: true;
      version: 3;
      document: OpenAPIV3.Document;
      errors: OpenAPISchemaValidatorResult["errors"];
    }
  | {
      valid: false;
      version: 2 | 3;
      document: unknown;
      errors: OpenAPISchemaValidatorResult["errors"];
    };
