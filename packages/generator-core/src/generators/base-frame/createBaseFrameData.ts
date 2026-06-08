import { pascalCase } from "change-case";
import { getBaseFrameJsDoc } from "#generators/base-frame/getBaseFrameJsDoc.js";
import { getFrameDecoratorArgument } from "#generators/base-frame/getFrameDecoratorArgument.js";
import { getServerVariableDefaultMethods } from "#generators/base-frame/getServerVariableDefaultMethods.js";
import { getServerVariableDefaults } from "#generators/base-frame/getServerVariableDefaults.js";
import { getServerVariableProperties } from "#generators/base-frame/getServerVariableProperties.js";
import type { IBaseFrameData } from "#generators/base-frame/interfaces/IBaseFrameData.js";
import type { ICreateBaseFrameProps } from "#generators/base-frame/interfaces/ICreateBaseFrameProps.js";

export function createBaseFrameData(params: ICreateBaseFrameProps): IBaseFrameData {
  const name = pascalCase(params.name);
  const timeout = params.timeout ?? 60_000;
  const serverVariables = Object.entries(params.serverVariables ?? {});
  const serverVariableDefaults = getServerVariableDefaults(serverVariables);

  return {
    name,
    filePath: `${name}.ts`,
    docs: getBaseFrameJsDoc(params),
    imports: [
      {
        moduleSpecifier: "jin-frame",
        namedImports: ["Get", ...(serverVariables.length > 0 ? ["Param"] : []), "JinFrame", "Timeout"],
      },
    ],
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
    extends: "JinFrame<SUCCESS, FAIL>",
  };
}
