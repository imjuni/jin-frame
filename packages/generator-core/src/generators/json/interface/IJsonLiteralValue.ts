export interface IJsonLiteralValue {
  key: string;
  value: unknown;
  isFunction?: boolean; // Mark if value should be treated as function
}
