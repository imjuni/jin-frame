import type { OpenAPIV3, OpenAPIV3_1 } from "openapi-types";
import type { OpenAPI3 } from "openapi-typescript";
import { createOpenapiTsOptions } from "#openapi/createOpenapiTsOptions.js";
import type { ICreateOpenapiTsOptions } from "#openapi/interfaces/ICreateOpenapiTsOptions.js";

export async function createOpenapiTs(
  document: OpenAPIV3.Document | OpenAPIV3_1.Document,
  option: ICreateOpenapiTsOptions,
): Promise<string> {
  const { onEvent, ...typeOptions } = option;
  onEvent?.({ type: "stage", stage: "generate-types", state: "started" });
  const openapiTypescript = await import("openapi-typescript");
  const nodes = await openapiTypescript.default(document as OpenAPI3, createOpenapiTsOptions(typeOptions));
  const source = openapiTypescript.COMMENT_HEADER + openapiTypescript.astToString(nodes);
  onEvent?.({ type: "stage", stage: "generate-types", state: "completed" });
  return source;
}
