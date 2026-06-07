import { randomUUID } from "node:crypto";
import { pascalCase } from "change-case";
import type { Project } from "ts-morph";
import { getBaseFrameJsDoc } from "#/generators/base-frame/getBaseFrameJsDoc";
import { getFrameDecoratorArgument } from "#/generators/base-frame/getFrameDecoratorArgument";
import { getServerVariableDefaultMethods } from "#/generators/base-frame/getServerVariableDefaultMethods";
import { getServerVariableDefaults } from "#/generators/base-frame/getServerVariableDefaults";
import { getServerVariableProperties } from "#/generators/base-frame/getServerVariableProperties";
import type { ICreateBaseFrameProps } from "#/generators/base-frame/interfaces/ICreateBaseFrameProps";
import type { ICreateBaseFrameResult } from "#/generators/base-frame/interfaces/ICreateBaseFrameResult";

export function createBaseFrame(project: Project, params: ICreateBaseFrameProps): ICreateBaseFrameResult {
  const name = pascalCase(params.name);
  const timeout = params?.timeout ?? 60_000;
  const aliasFilePath = `${randomUUID()}-${randomUUID()}.ts`;
  const sourceFile = project.createSourceFile(aliasFilePath);
  const serverVariables = Object.entries(params.serverVariables ?? {});
  const serverVariableDefaults = getServerVariableDefaults(serverVariables);

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
    properties: getServerVariableProperties(serverVariables),
    methods: getServerVariableDefaultMethods(name, serverVariableDefaults),
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
