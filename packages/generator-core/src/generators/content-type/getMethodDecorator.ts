import { applicationJsonContentType } from '#/generators/content-type/preferredContentTypes';
import { getJsonArgument } from '#/generators/json/getJsonArgument';
import type { IJsonLiteralValue } from '#/generators/json/interface/IJsonLiteralValue';
import type { DecoratorStructure } from 'ts-morph';
import { StructureKind } from 'ts-morph';

interface IProps {
  method: string;
  contentType?: string;
  host: string | (() => string);
  hostCode?: string;
  path: string;
  baseFrame?: string;
}

export function getMethodDecorator(params: IProps): DecoratorStructure {
  const jsonLiteralValue: IJsonLiteralValue[] = [];

  if (params.baseFrame == null) {
    if (params.hostCode != null) {
      // Raw generated code (function name, arrow function, etc.) — embed verbatim
      jsonLiteralValue.push({ key: 'host', value: params.hostCode, isFunction: true });
    } else if (typeof params.host === 'string') {
      jsonLiteralValue.push({ key: 'host', value: params.host });
    } else {
      jsonLiteralValue.push({ key: 'host', value: params.host, isFunction: true });
    }
  }

  jsonLiteralValue.push({ key: 'path', value: params.path });

  if (params.contentType != null && params.contentType !== applicationJsonContentType) {
    jsonLiteralValue.push({ key: 'contentType', value: params.contentType });
  }

  const decoratorArguments = getJsonArgument({
    values: jsonLiteralValue,
  });

  return {
    name: params.method,
    kind: StructureKind.Decorator,
    arguments: decoratorArguments != null ? [decoratorArguments] : undefined,
  };
}
