import type { IJsonLiteralValue } from "#/generators/json/interface/IJsonLiteralValue.js";

export interface IGetJsonArgumentProps {
  values?: (IJsonLiteralValue | null | undefined)[];
  quote?: '"' | "'" | "`";
}
