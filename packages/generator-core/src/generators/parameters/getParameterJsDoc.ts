import { getParameterJsDocExamplesContent } from '#/generators/parameters/getParameterJsDocExamplesContent';
import type { OpenAPIV3 } from 'openapi-types';

export function getParameterJsDoc(
  params: Pick<OpenAPIV3.ParameterObject, 'description' | 'example' | 'examples'>,
): string[] {
  const docs: string[] = [];
  const exampleDocs: string[] = [];

  const { description, example, examples } = params;

  if (description == null && example == null && examples == null) {
    return [];
  }

  if (description != null) {
    docs.push(description);
  }

  if (example != null) {
    exampleDocs.push(`@example ${example}`);
  }

  if (examples != null) {
    exampleDocs.push(
      ...Object.entries(examples)
        .map(([contentType, exampleValue]) =>
          getParameterJsDocExamplesContent({
            contentType,
            example: exampleValue as OpenAPIV3.ExampleObject,
            options: { useCodeFence: true },
          }),
        )
        .filter((exampleDoc) => exampleDoc != null),
    );
  }

  if (exampleDocs.length > 0) {
    return [[...docs, '', ...exampleDocs].join('\n')];
  }

  return [docs.join('\n')];
}
