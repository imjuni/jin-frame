import { safeStringify } from "#tools/safeStringify.js";

export function getExampleValue(params: { isJsonish: boolean; useCodeFence: boolean; value: unknown }): string {
  if (params.isJsonish || params.useCodeFence) {
    return `\`\`\`json\n${safeStringify(params.value, undefined, 2)}\n\`\`\``;
  }

  if (typeof params.value === "string") {
    return params.value;
  }

  return safeStringify(params.value);
}
