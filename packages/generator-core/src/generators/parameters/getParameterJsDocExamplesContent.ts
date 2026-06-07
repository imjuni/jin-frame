import { getExampleValue } from "#/generators/parameters/getExampleValue";
import type { IGetParameterJsDocExamplesContentProps } from "#/generators/parameters/interfaces/IGetParameterJsDocExamplesContentProps";

export function getParameterJsDocExamplesContent(params: IGetParameterJsDocExamplesContentProps): string {
  const { summary, description, value } = params.example;

  const stringifiedDescription = [
    summary == null ? undefined : ` ${summary} `,
    description == null ? undefined : ` ${description} `,
  ]
    .filter((element) => element != null)
    .join("-");

  const isJsonish = params.contentType === "application/json" || params.contentType.endsWith("+json");

  const stringifiedValue = getExampleValue({
    isJsonish,
    useCodeFence: params.options.useCodeFence,
    value,
  });

  return `@example (${params.contentType})${stringifiedDescription}\n${stringifiedValue}`;
}
