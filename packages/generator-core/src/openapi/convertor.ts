import type { validate } from '#/openapi/validate';
import swagger2openapi from 'swagger2openapi';

export async function convertor(
  document: Extract<ReturnType<typeof validate>, { valid: true }>,
): Promise<Extract<ReturnType<typeof validate>, { valid: true; version: 3 }>> {
  if (document.version === 2) {
    const converted = await swagger2openapi.convert(document.document, {});
    return { ...document, version: 3, document: converted.openapi };
  }

  return document;
}
