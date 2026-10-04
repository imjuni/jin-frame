import type { TCommandInput } from "#schema/args/TCommandInput.js";

export function compactUndefined(record: TCommandInput): TCommandInput {
  return Object.fromEntries(Object.entries(record).filter(([, value]) => value !== undefined));
}
