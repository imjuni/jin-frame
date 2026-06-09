import type { DecoratorStructure } from "ts-morph";
import { StructureKind } from "ts-morph";
import { applicationJsonContentType } from "#generators/content-type/applicationJsonContentType.js";
import type { IGetMethodDecoratorProps } from "#generators/content-type/interfaces/IGetMethodDecoratorProps.js";
import { getJsonArgument } from "#generators/json/getJsonArgument.js";
import type { IJsonLiteralValue } from "#generators/json/interface/IJsonLiteralValue.js";

export function getMethodDecorator(params: IGetMethodDecoratorProps): DecoratorStructure {
  const jsonLiteralValue: IJsonLiteralValue[] = [];
  const host = params.hostOverride ?? params.host;

  if (params.baseFrame == null || params.hostOverride != null) {
    if (params.hostOverride != null) {
      jsonLiteralValue.push({ key: "host", value: params.hostOverride });
    } else if (params.hostCode != null) {
      // Raw generated code (function name, arrow function, etc.) — embed verbatim
      jsonLiteralValue.push({ key: "host", value: params.hostCode, isFunction: true });
    } else if (typeof host === "string") {
      jsonLiteralValue.push({ key: "host", value: host });
    } else {
      jsonLiteralValue.push({ key: "host", value: host, isFunction: true });
    }
  }

  jsonLiteralValue.push({ key: "path", value: params.path });

  if (params.contentType != null && params.contentType !== applicationJsonContentType) {
    jsonLiteralValue.push({ key: "contentType", value: params.contentType });
  }

  if (params.securityProviderClassNames != null && params.securityProviderClassNames.length > 0) {
    const securityValue =
      params.securityProviderClassNames.length === 1
        ? `new ${params.securityProviderClassNames[0]}()`
        : `[${params.securityProviderClassNames.map((className) => `new ${className}()`).join(", ")}]`;
    jsonLiteralValue.push({ key: "security", value: securityValue, isFunction: true });
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
