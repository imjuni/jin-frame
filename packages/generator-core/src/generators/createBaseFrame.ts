import { randomUUID } from "node:crypto";
import { pascalCase } from "change-case";
import type { OpenAPIV3 } from "openapi-types";
import { type Project, Scope, StructureKind } from "ts-morph";
import { getJsonArgument } from "#/generators/json/getJsonArgument";
import type { IJsonLiteralValue } from "#/generators/json/interface/IJsonLiteralValue";

function getBaseFrameJsDoc(params: Pick<IProps, "timeout" | "host" | "pathPrefix">): string {
  const endpoint = [params.host ?? "", params.pathPrefix ?? ""].filter((part) => part !== "").join("");
  const endpointDescription = endpoint !== "" ? `\n\nEndpoint: ${endpoint}` : "";

  const defaultTimeout = `Server Host Frame

In most infrastructures, such as Cloudflare, AWS ALB, and Nginx, 
the default timeout value is around 60 seconds. The default timeout 
has been set to 60 seconds.${endpointDescription}`;

  const withTimeout = `Server Host Frame

Timeout ${params.timeout} milliseconds.${endpointDescription}`;

  if (params.timeout != null) {
    return withTimeout;
  }

  return defaultTimeout;
}

interface IProps {
  output: string;
  host?: string | (() => string);
  hostCode?: string;
  pathPrefix?: string | (() => string);
  pathPrefixCode?: string;
  name: string;
  timeout?: number;
  serverVariables?: Record<string, OpenAPIV3.ServerVariableObject>;
}

interface IResult {
  filePath: string;
  tag?: string;
  aliasFilePath: string;
  source: string;
}

function getServerVariableType(variable: OpenAPIV3.ServerVariableObject): string {
  if (variable.enum == null || variable.enum.length === 0) {
    return "string";
  }

  return variable.enum.map((value) => `'${value}'`).join(" | ");
}

function getServerVariableName(name: string): string {
  return /^[A-Za-z_$][\w$]*$/.test(name) ? name : `'${name}'`;
}

function getServerVariableDocs(variable: OpenAPIV3.ServerVariableObject): string | undefined {
  const docs = [
    variable.description,
    variable.default != null ? `@default ${variable.default}` : undefined,
    variable.enum != null && variable.enum.length > 0 ? `@enum ${variable.enum.join(", ")}` : undefined,
  ].filter((doc) => doc != null && doc !== "");

  return docs.length > 0 ? docs.join("\n") : undefined;
}

function getFrameDecoratorArgument(
  params: Pick<IProps, "host" | "hostCode" | "pathPrefix" | "pathPrefixCode">,
): string {
  const values: IJsonLiteralValue[] = [];

  if (params.hostCode != null) {
    values.push({ key: "host", value: params.hostCode, isFunction: true });
  } else if (params.host != null) {
    values.push({
      key: "host",
      value: params.host,
      isFunction: typeof params.host === "function",
    });
  }

  if (params.pathPrefixCode != null) {
    values.push({ key: "pathPrefix", value: params.pathPrefixCode, isFunction: true });
  } else if (params.pathPrefix != null) {
    values.push({
      key: "pathPrefix",
      value: params.pathPrefix,
      isFunction: typeof params.pathPrefix === "function",
    });
  }

  return getJsonArgument({ values }) ?? "{}";
}

export function createBaseFrame(project: Project, params: IProps): IResult {
  const name = pascalCase(params.name);
  const timeout = params?.timeout ?? 60_000;
  const aliasFilePath = `${randomUUID()}-${randomUUID()}.ts`;
  const sourceFile = project.createSourceFile(aliasFilePath);
  const serverVariables = Object.entries(params.serverVariables ?? {});
  const serverVariableDefaults = Object.fromEntries(
    serverVariables
      .filter(
        (entry): entry is [string, OpenAPIV3.ServerVariableObject & { default: string }] => entry[1].default != null,
      )
      .map(([variableName, variable]) => [variableName, variable.default]),
  );
  const hasServerVariableDefaults = Object.keys(serverVariableDefaults).length > 0;

  sourceFile.addImportDeclaration({
    moduleSpecifier: "jin-frame",
    namedImports: ["Get", ...(serverVariables.length > 0 ? ["Param"] : []), "JinFrame", "Timeout"],
  });

  sourceFile.addClass({
    name,
    docs: [{ description: getBaseFrameJsDoc(params) }],
    typeParameters: [
      {
        name: "SUCCESS",
        default: "unknown",
      },
      {
        name: "FAIL",
        default: "unknown",
      },
    ],
    decorators: [
      {
        name: "Get",
        arguments: [getFrameDecoratorArgument(params)],
      },
      timeout != null
        ? {
            name: "Timeout",
            arguments: [`${timeout}`],
          }
        : undefined,
    ].filter((decorator) => decorator != null),
    properties: serverVariables.map(([variableName, variable]) => ({
      decorators: [{ name: "Param", arguments: [] }],
      docs: getServerVariableDocs(variable) != null ? [{ description: getServerVariableDocs(variable) ?? "" }] : [],
      name: getServerVariableName(variableName),
      type: getServerVariableType(variable),
      hasDeclareKeyword: true,
      isReadonly: true,
      hasQuestionToken: variable.default != null,
      scope: Scope.Public,
      kind: StructureKind.Property,
    })),
    methods: hasServerVariableDefaults
      ? [
          {
            name: "getDefaultValues",
            isStatic: true,
            hasOverrideKeyword: true,
            scope: Scope.Protected,
            returnType: `Partial<${name}>`,
            statements: [`return ${JSON.stringify(serverVariableDefaults)};`],
          },
        ]
      : [],
    isExported: true,
    extends: "JinFrame<SUCCESS, FAIL>",
  });

  return {
    filePath: `${name}.ts`,
    tag: undefined,
    aliasFilePath,
    source: sourceFile.print(),
  };
}
