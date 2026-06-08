import { pascalCase } from "change-case";
import type { OpenAPIV3 } from "openapi-types";
import { getMethodDecorator } from "#generators/content-type/getMethodDecorator.js";
import { getRequestContentType } from "#generators/content-type/getRequestContentType.js";
import { getResponseContentType } from "#generators/content-type/getResponseContentType.js";
import { getResponseTypeMappedAccessPath } from "#generators/content-type/getResponseTypeMappedAccessPath.js";
import type { ICreateFrameProps } from "#generators/frame/interfaces/ICreateFrameProps.js";
import type { IFrameData } from "#generators/frame/interfaces/IFrameData.js";
import { getClassJsDoc } from "#generators/getClassJsDoc.js";
import { getFrameName } from "#generators/getFrameName.js";
import { getJsonArgument } from "#generators/json/getJsonArgument.js";
import { getBodyParameter } from "#generators/parameters/getBodyParameter.js";
import { getParameter } from "#generators/parameters/getParameter.js";
import { dotRelative } from "#tools/dotRelative.js";
import { removeExt } from "#tools/removeExt.js";
import { safePathJoin } from "#tools/safePathJoin.js";

export function createFrameData(params: ICreateFrameProps): IFrameData {
  const name = getFrameName({
    pathKey: params.pathKey,
    method: params.method,
    operationId: params.operation?.operationId,
  });
  const filePath = `${name}.ts`;
  const originMethod = params.method.toLowerCase();
  const method = pascalCase(originMethod);
  const docs = getClassJsDoc(params);
  const requestContentType = getRequestContentType(params.operation.requestBody);
  const responseContentType = getResponseContentType(params.operation.responses);
  const methodDecorator = getMethodDecorator({
    host: params.host,
    hostCode: params.hostCode,
    hostOverride: params.hostOverride,
    path: params.pathKey,
    baseFrame: params.baseFrame,
    method,
    contentType: requestContentType,
  });
  const tag = params.operation.tags?.at(0);

  const parameters =
    params.operation.parameters
      ?.map((parameter) =>
        getParameter({
          method: originMethod,
          pathKey: params.pathKey,
          parameter: parameter as OpenAPIV3.ParameterObject,
        }),
      )
      .filter((parameter) => parameter != null) ?? [];
  const properties = parameters.map((parameter) => parameter.property);

  const bodies = getBodyParameter({
    method: originMethod,
    pathKey: params.pathKey,
    contentType: requestContentType,
    requestBody: params.operation.requestBody,
  });

  properties.push(...bodies.map((body) => body.property));

  const bodyNamedImports = [
    ...parameters.map((parameter) => parameter.decorator),
    ...bodies.map((body) => body.decorator),
  ];
  const usesJinFile = properties.some((property) => property.type?.toString().includes("JinFile"));
  const jinFrameNamedImports = [
    method,
    ...Array.from(new Set<string>(bodyNamedImports)),
    ...(usesJinFile ? ["JinFile"] : []),
    ...(params.timeout != null ? ["Timeout"] : []),
    ...(params.retry != null ? ["Retry"] : []),
  ];

  const imports =
    params.baseFrame != null
      ? [
          {
            moduleSpecifier: "jin-frame",
            namedImports: jinFrameNamedImports,
          },
          {
            moduleSpecifier: `${dotRelative(
              safePathJoin(params.output, tag),
              safePathJoin(params.output, params.baseFrame),
            )}.js`,
            namedImports: [params.baseFrame],
          },
        ]
      : [
          {
            moduleSpecifier: "jin-frame",
            namedImports: [...jinFrameNamedImports, "JinFrame"],
          },
        ];

  imports.push({
    moduleSpecifier: `${dotRelative(safePathJoin(params.output, tag), removeExt(params.specTypeFilePath))}.js`,
    namedImports: ["paths"],
  });

  return {
    name,
    filePath,
    tag,
    docs,
    imports,
    decorators: [
      methodDecorator,
      params.timeout != null
        ? {
            name: "Timeout",
            arguments: [`${params.timeout}`],
          }
        : undefined,
      params.retry != null
        ? {
            name: "Retry",
            arguments: [
              getJsonArgument({
                values: Object.entries(params.retry).map(([key, value]) => ({ key, value })),
              }) ?? "{}",
            ],
          }
        : undefined,
    ].filter((decorator) => decorator != null),
    properties,
    parentFrame: params.baseFrame ?? "JinFrame",
    responseTypeMappedAccessPath: getResponseTypeMappedAccessPath({
      method: originMethod,
      pathKey: params.pathKey,
      responseContentType,
    }),
  };
}
