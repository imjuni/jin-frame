import { randomUUID } from "node:crypto";
import { pascalCase } from "change-case";
import type { OpenAPIV3 } from "openapi-types";
import type { Project } from "ts-morph";
import { getMethodDecorator } from "#/generators/content-type/getMethodDecorator";
import { getRequestContentType } from "#/generators/content-type/getRequestContentType";
import { getResponseContentType } from "#/generators/content-type/getResponseContentType";
import { getResponseTypeMappedAccessPath } from "#/generators/content-type/getResponseTypeMappedAccessPath";
import type { ICreateFrameProps } from "#/generators/frame/interfaces/ICreateFrameProps";
import type { ICreateFrameResult } from "#/generators/frame/interfaces/ICreateFrameResult";
import { getClassJsDoc } from "#/generators/getClassJsDoc";
import { getFrameName } from "#/generators/getFrameName";
import { getBodyParameter } from "#/generators/parameters/getBodyParameter";
import { getParameter } from "#/generators/parameters/getParameter";
import { dotRelative } from "#/tools/dotRelative";
import { removeExt } from "#/tools/removeExt";
import { safePathJoin } from "#/tools/safePathJoin";

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
  ];

  if (params.baseFrame != null) {
    sourceFile.addImportDeclaration({
      moduleSpecifier: "jin-frame",
      namedImports: jinFrameNamedImports,
    });
    sourceFile.addImportDeclaration({
      moduleSpecifier: dotRelative(
        safePathJoin(params.output, firstTag),
        safePathJoin(params.output, params.baseFrame),
      ),
      namedImports: [params.baseFrame],
    });
  } else {
    sourceFile.addImportDeclaration({
      moduleSpecifier: "jin-frame",
      namedImports: [...jinFrameNamedImports, "JinFrame"],
    });
  }

  sourceFile.addImportDeclaration({
    moduleSpecifier: dotRelative(safePathJoin(params.output, firstTag), removeExt(params.specTypeFilePath)),
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
    decorators: [methodDecorator],
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
