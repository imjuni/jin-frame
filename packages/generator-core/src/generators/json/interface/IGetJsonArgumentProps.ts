import type { IJsonLiteralValue } from "#/generators/json/interface/IJsonLiteralValue";

export interface IGetJsonArgumentProps {
  values?: (IJsonLiteralValue | null | undefined)[];
  quote?: '"' | "'" | "`";
}
