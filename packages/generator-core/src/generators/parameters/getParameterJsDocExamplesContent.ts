import { safeStringify } from '#/tools/safeStringify';
import type { OpenAPIV3 } from 'openapi-types';

interface IProps {
  contentType: string;
  example: OpenAPIV3.ExampleObject;
  options: {
    useCodeFence: boolean;
  };
}

function getExampleValue(params: { isJsonish: boolean; useCodeFence: boolean; value: unknown }): string {
  if (params.isJsonish || params.useCodeFence) {
    return `\`\`\`json\n${safeStringify(params.value, undefined, 2)}\n\`\`\``;
  }

  if (typeof params.value === 'string') {
    return params.value;
  }

  return safeStringify(params.value);
}

export function getParameterJsDocExamplesContent(params: IProps): string {
  const { summary, description, value } = params.example;

  const stringifiedDescription = [
    summary == null ? undefined : ` ${summary} `,
    description == null ? undefined : ` ${description} `,
  ]
    .filter((element) => element != null)
    .join('-');

  const isJsonish = params.contentType === 'application/json' || params.contentType.endsWith('+json');

  const stringifiedValue = getExampleValue({
    isJsonish,
    useCodeFence: params.options.useCodeFence,
    value,
  });

  return `@example (${params.contentType})${stringifiedDescription}\n${stringifiedValue}`;
}
