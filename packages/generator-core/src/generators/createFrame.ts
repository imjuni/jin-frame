import { randomUUID } from "node:crypto";
import { pascalCase } from "change-case";
import type { OpenAPIV3 } from "openapi-types";
import type { Project } from "ts-morph";
import { getMethodDecorator } from "#generators/content-type/getMethodDecorator.js";
import { getRequestContentType } from "#generators/content-type/getRequestContentType.js";
import { getResponseContentType } from "#generators/content-type/getResponseContentType.js";
import { getResponseTypeMappedAccessPath } from "#generators/content-type/getResponseTypeMappedAccessPath.js";
import type { ICreateFrameProps } from "#generators/frame/interfaces/ICreateFrameProps.js";
import type { ICreateFrameResult } from "#generators/frame/interfaces/ICreateFrameResult.js";
import { getClassJsDoc } from "#generators/getClassJsDoc.js";
import { getFrameName } from "#generators/getFrameName.js";
import { getJsonArgument } from "#generators/json/getJsonArgument.js";
import { getBodyParameter } from "#generators/parameters/getBodyParameter.js";
import { getParameter } from "#generators/parameters/getParameter.js";
import { dotRelative } from "#tools/dotRelative.js";
import { removeExt } from "#tools/removeExt.js";
import { safePathJoin } from "#tools/safePathJoin.js";

export function createFrame(project: Project, params: ICreateFrameProps): ICreateFrameResult {
  const aliasFilePath = `${randomUUID()}-${randomUUID()}.ts`;
  const name = getFrameName({
    pathKey: params.pathKey,
    method: params.method,
    operationId: params.operation?.operationId,
  });
  const filePath = `${name}.ts`;
  const sourceFile = project.createSourceFile(aliasFilePath);
  const originMethod = params.method.toLowerCase();
  const method = pascalCase(originMethod.toLowerCase());
  const description = getClassJsDoc(params);
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
  const firstTag = params.operation.tags?.at(0);

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
  const properties = parameters?.map((parameter) => parameter.property);

  const bodies = getBodyParameter({
    method: originMethod,
    pathKey: params.pathKey,
    contentType: requestContentType,
    requestBody: params.operation.requestBody,
  });

  if (bodies != null) {
    properties.push(...bodies.map((body) => body.property));
  }

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

  if (params.baseFrame != null) {
    sourceFile.addImportDeclaration({
      moduleSpecifier: "jin-frame",
      namedImports: jinFrameNamedImports,
    });
    sourceFile.addImportDeclaration({
      moduleSpecifier: `${dotRelative(
        safePathJoin(params.output, firstTag),
        safePathJoin(params.output, params.baseFrame),
      )}.js`,
      namedImports: [params.baseFrame],
    });
  } else {
    sourceFile.addImportDeclaration({
      moduleSpecifier: "jin-frame",
      namedImports: [...jinFrameNamedImports, "JinFrame"],
    });
  }

  sourceFile.addImportDeclaration({
    moduleSpecifier: `${dotRelative(safePathJoin(params.output, firstTag), removeExt(params.specTypeFilePath))}.js`,
    namedImports: ["paths"],
  });

  const parentFrame = params.baseFrame ?? "JinFrame";

  const responseTypeMappedAccessPath = getResponseTypeMappedAccessPath({
    method: originMethod,
    pathKey: params.pathKey,
    responseContentType,
  });

  sourceFile.addClass({
    name,
    docs: [{ description }],
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
    isExported: true,
    extends: `${parentFrame}<paths${responseTypeMappedAccessPath}>`,
  });

  return {
    filePath,
    tag: firstTag,
    aliasFilePath,
    source: sourceFile.print(),
  };
}
