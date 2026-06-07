import type { IGetJsonArgumentProps } from "#generators/json/interface/IGetJsonArgumentProps.js";

export function getJsonArgument(_params?: IGetJsonArgumentProps): string | undefined {
  const params = (_params?.values ?? []).filter((param) => param != null);
  const quote = _params?.quote ?? "'";

  const stringifyValue = (value: unknown): string | undefined => {
    if (typeof value === "function") {
      return value.toString();
    }

    if (Array.isArray(value)) {
      const values = value.map((entry) => stringifyValue(entry));

      if (values.some((entry) => entry == null)) {
        return undefined;
      }

      return `[${values.join(", ")}]`;
    }

    switch (typeof value) {
      case "string":
        return `${quote}${value}${quote}`;
      case "number":
        return `${value}`;
      case "boolean":
        return `${value}`;
      case "object": {
        if (value == null) {
          return undefined;
        }

        const entries = Object.entries(value)
          .map(([key, entry]) => {
            const stringified = stringifyValue(entry);
            return stringified == null ? undefined : `${key}: ${stringified}`;
          })
          .filter((entry) => entry != null);

        if (entries.length === 0) {
          return "{}";
        }

        return `{ ${entries.join(", ")} }`;
      }
      default:
        return undefined;
    }
  };

  const joined = params
    .map((param) => {
      // Handle function values
      if (param.isFunction || typeof param.value === "function") {
        const functionCode = typeof param.value === "function" ? param.value.toString() : param.value;
        return `${param.key}: ${functionCode}`;
      }

      const stringified = stringifyValue(param.value);
      return stringified == null ? undefined : `${param.key}: ${stringified}`;
    })
    .filter((param) => param != null)
    .join(", ");

  if (joined === "") {
    return undefined;
  }

  return `{ ${joined} }`;
}
