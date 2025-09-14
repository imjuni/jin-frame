import type { IJsonLiteralValue } from '#/generators/json/interface/IJsonLiteralValue';

interface IProps {
  values?: (IJsonLiteralValue | null | undefined)[];
  quote?: '"' | "'" | '`';
}

export function getJsonArgument(_params?: IProps): string | undefined {
  const params = (_params?.values ?? []).filter((param) => param != null);
  const quote = _params?.quote ?? "'";

  const joined = params
    .map((param) => {
      switch (typeof param.value) {
        case 'string':
          return `${param.key}: ${quote}${param.value}${quote}`;
        case 'number':
          return `${param.key}: ${param.value}`;
        case 'boolean':
          return `${param.key}: ${param.value}`;
        default:
          return undefined;
      }
    })
    .filter((param) => param != null)
    .join(', ');

  if (joined === '') {
    return undefined;
  }

  return `{ ${joined} }`;
}
