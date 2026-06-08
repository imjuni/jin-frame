import { pascalCase } from "change-case";
import type { OpenAPIV3 } from "openapi-types";
import type { OptionalKind, PropertyDeclarationStructure, TypeAliasDeclarationStructure } from "ts-morph";
import { getFrameResponseTypes } from "#generators/content-type/getFrameResponseTypes.js";
import { getMethodDecorator } from "#generators/content-type/getMethodDecorator.js";
import { getRequestContentType } from "#generators/content-type/getRequestContentType.js";
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

const parameterAliasMap = {
  Cookie: { aliasName: "FrameCookieParameter", location: "cookie" },
  Header: { aliasName: "FrameHeaderParameter", location: "header" },
  Param: { aliasName: "FramePathParameter", location: "path" },
  Query: { aliasName: "FrameQueryParameter", location: "query" },
} as const;

function getTypeText(type: PropertyDeclarationStructure["type"]): string | undefined {
  return typeof type === "string" ? type : undefined;
}

function getParameterAliasName(
  decorator: keyof typeof parameterAliasMap,
  usedParameterAliases: Set<keyof typeof parameterAliasMap>,
): string {
  if (usedParameterAliases.size === 1) {
    return "FrameRequestParameter";
  }

  return parameterAliasMap[decorator].aliasName;
}

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
  const operationTypePath = `paths['${params.pathKey}']['${originMethod}']`;
  const responseTypes = getFrameResponseTypes({
    method: originMethod,
    pathKey: params.pathKey,
    responses: params.operation.responses,
  });
  const typeAliases: OptionalKind<TypeAliasDeclarationStructure>[] = [];
  const parentFrameResponseTypes = responseTypes.map((responseType, index) => {
    if (responseType === "void") {
      return responseType;
    }

    const aliasName = index === 0 ? "SuccessResponse" : "FailResponse";
    typeAliases.push({
      name: aliasName,
      type: responseType,
      docs: [{ description: "Response DTO" }],
      isExported: false,
    });

    return aliasName;
  });
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
  const usedParameterAliases = new Set(parameters.map((parameter) => parameter.decorator));
  const properties: PropertyDeclarationStructure[] = parameters.map((parameter) => {
    const alias = parameterAliasMap[parameter.decorator];
    const aliasName = getParameterAliasName(parameter.decorator, usedParameterAliases);

    return {
      ...parameter.property,
      type: getTypeText(parameter.property.type)?.replace(
        `NonNullable<${operationTypePath}['parameters']['${alias.location}']>`,
        `NonNullable<${aliasName}>`,
      ),
    };
  });

  for (const decorator of usedParameterAliases) {
    const alias = parameterAliasMap[decorator];
    const aliasName = getParameterAliasName(decorator, usedParameterAliases);
    typeAliases.push({
      name: aliasName,
      type: `${operationTypePath}['parameters']['${alias.location}']`,
      docs: [{ description: "Request DTO" }],
      isExported: false,
    });
  }

  const bodies = getBodyParameter({
    method: originMethod,
    pathKey: params.pathKey,
    contentType: requestContentType,
    requestBody: params.operation.requestBody,
  });

  const bodyTypePath =
    requestContentType != null
      ? `NonNullable<${operationTypePath}['requestBody']>['content']['${requestContentType}']`
      : undefined;
  const bodyProperties: PropertyDeclarationStructure[] = bodies.map((body) => ({
    ...body.property,
    type:
      bodyTypePath != null
        ? getTypeText(body.property.type)?.replaceAll(bodyTypePath, "FrameRequestBody")
        : body.property.type,
  }));

  if (
    bodyTypePath != null &&
    bodyProperties.some((property) => getTypeText(property.type)?.includes("FrameRequestBody"))
  ) {
    typeAliases.push({
      name: "FrameRequestBody",
      type: bodyTypePath,
      docs: [{ description: "Request DTO" }],
      isExported: false,
    });
  }

  properties.push(...bodyProperties);

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
    typeAliases,
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
    responseTypes: parentFrameResponseTypes,
  };
}
