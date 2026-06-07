import type { IGetJsonArgumentProps } from "#/generators/json/interface/IGetJsonArgumentProps";

export function getJsonArgument(_params?: IGetJsonArgumentProps): string | undefined {
  const params = (_params?.values ?? []).filter((param) => param != null);
  const quote = _params?.quote ?? "'";

  const joined = params
    .map((param) => {
      // Handle function values
      if (param.isFunction || typeof param.value === "function") {
        const functionCode = typeof param.value === "function" ? param.value.toString() : param.value;
        return `${param.key}: ${functionCode}`;
      }

      switch (typeof param.value) {
        case "string":
          return `${param.key}: ${quote}${param.value}${quote}`;
        case "number":
          return `${param.key}: ${param.value}`;
        case "boolean":
          return `${param.key}: ${param.value}`;
        default:
          return undefined;
      }
    })
    .filter((param) => param != null)
    .join(", ");

  if (joined === "") {
    return undefined;
  }

  return `{ ${joined} }`;
}
