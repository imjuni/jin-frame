import { getServerVariableDocs } from "#generators/base-frame/getServerVariableDocs.js";
import { getServerVariableName } from "#generators/base-frame/getServerVariableName.js";
import { getServerVariableType } from "#generators/base-frame/getServerVariableType.js";
import type { ICreateBaseFrameProps } from "#generators/base-frame/interfaces/ICreateBaseFrameProps.js";
import type { IPropertyData } from "#generators/interfaces/IPropertyData.js";

export function getServerVariableProperties(
  serverVariables: [string, NonNullable<ICreateBaseFrameProps["serverVariables"]>[string]][],
): IPropertyData[] {
  return serverVariables.map(([variableName, variable]) => ({
    decorators: [{ name: "Param", arguments: [] }],
    docs: getServerVariableDocs(variable) != null ? [getServerVariableDocs(variable) ?? ""] : [],
    name: getServerVariableName(variableName),
    type: getServerVariableType(variable),
    hasDeclareKeyword: true,
    isReadonly: true,
    hasQuestionToken: variable.default != null,
  }));
}
