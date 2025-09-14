import type { THttpMethod } from '#/https/method';
import type { Project } from 'ts-morph';
import { pascalCase } from 'change-case';
import { getFrameName } from '#/generators/getFrameName';
import { getClassJsDoc } from '#/generators/getClassJsDoc';
import { swaggerPathToPathToRegexp } from '#/generators/swaggerPathToPathToRegexp';
import type { OpenAPIV3 } from 'openapi-types';
import { getParameter } from '#/generators/parameters/getParameter';
import { getRequestContentType } from '#/generators/content-type/getRequestContentType';
import { getResponseContentType } from '#/generators/content-type/getResponseContentType';
import { getBodyParameter } from '#/generators/parameters/getBodyParameter';
import { randomUUID } from 'node:crypto';
import { getMethodDecorator } from '#/generators/content-type/getMethodDecorator';
import { dotRelative } from '#/tools/dotRelative';
import { safePathJoin } from '#/tools/safePathJoin';
import { removeExt } from '#/tools/removeExt';
import { getResponeTypeMappedAccessPath } from '#/generators/content-type/getResponeTypeMappedAccessPath';

interface IProps {
  specTypeFilePath: string;
  baseFrame?: string;
  output: string;
  host: string;
  pathKey: string;
  operation: OpenAPIV3.OperationObject;
  method: THttpMethod;
}

interface IResult {
  filePath: string;
  tag?: string;
  aliasFilePath: string;
  source: string;
}

export function createFrame(project: Project, params: IProps): IResult {
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
  const pathToRegex = swaggerPathToPathToRegexp(params.pathKey);
  const requestContentType = getRequestContentType(params.operation.requestBody);
  const responseContentType = getResponseContentType(params.operation.responses);
  const methodDecorator = getMethodDecorator({
    host: params.host,
    path: pathToRegex,
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

  if (params.baseFrame != null) {
    sourceFile.addImportDeclaration({
      moduleSpecifier: 'jin-frame',
      namedImports: [method, ...Array.from(new Set<string>(bodyNamedImports))],
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
      moduleSpecifier: 'jin-frame',
      namedImports: [method, ...Array.from(new Set<string>(bodyNamedImports)), 'JinFrame'],
    });
  }

  sourceFile.addImportDeclaration({
    moduleSpecifier: dotRelative(safePathJoin(params.output, firstTag), removeExt(params.specTypeFilePath)),
    namedImports: ['paths'],
  });

  const parentFrame = params.baseFrame ?? 'JinFrame';

  const responeTypeMappedAccessPath = getResponeTypeMappedAccessPath({
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
    extends: `${parentFrame}<paths${responeTypeMappedAccessPath}>`,
  });

  return {
    filePath,
    tag: firstTag,
    aliasFilePath,
    source: sourceFile.print(),
  };
}
