import { convertor, createOpenapiTs, validate } from "@jin-frame/generator-core";
import { isOpenapi31Document } from "#commands/isOpenapi31Document.js";
import { isSwaggerV2Document } from "#commands/isSwaggerV2Document.js";

export async function resolveOpenapiDocument(document: unknown, specPath: string) {
  if (isOpenapi31Document(document)) {
    try {
      await createOpenapiTs(document as unknown as Parameters<typeof createOpenapiTs>[0], { silent: true });
    } catch (caught) {
      throw new Error(`Failed to validate OpenAPI 3.1 spec from "${specPath}"`, { cause: caught });
    }

    return { valid: true as const, version: 3 as const, document, errors: [] };
  }

  const validated = validate(document);

  if (validated.valid) {
    return convertor(validated);
  }

  if (!isSwaggerV2Document(document)) {
    throw new Error(`Failed to validate spec from "${specPath}"`);
  }

  const converted = await convertor({
    valid: true,
    version: 2,
    document,
    errors: validated.errors,
  });
  const convertedValidated = validate(converted.document);

  if (!convertedValidated.valid) {
    throw new Error(`Failed to validate converted spec from "${specPath}"`);
  }

  return convertor(convertedValidated);
}
