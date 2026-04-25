export interface IJsonLiteralValue {
  key: string;
  value: string | number | boolean | (() => string);
  isFunction?: boolean; // Mark if value should be treated as function
}
