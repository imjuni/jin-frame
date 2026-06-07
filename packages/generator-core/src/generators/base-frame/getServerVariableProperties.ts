import { type PropertyDeclarationStructure, Scope, StructureKind } from "ts-morph";
import { getServerVariableDocs } from "#/generators/base-frame/getServerVariableDocs.js";
import { getServerVariableName } from "#/generators/base-frame/getServerVariableName.js";
import { getServerVariableType } from "#/generators/base-frame/getServerVariableType.js";
import type { ICreateBaseFrameProps } from "#/generators/base-frame/interfaces/ICreateBaseFrameProps.js";

export function getServerVariableProperties(
  serverVariables: [string, NonNullable<ICreateBaseFrameProps["serverVariables"]>[string]][],
): PropertyDeclarationStructure[] {
  return serverVariables.map(([variableName, variable]) => ({
    decorators: [{ name: "Param", arguments: [] }],
    docs: getServerVariableDocs(variable) != null ? [{ description: getServerVariableDocs(variable) ?? "" }] : [],
    name: getServerVariableName(variableName),
    type: getServerVariableType(variable),
    hasDeclareKeyword: true,
    isReadonly: true,
    hasQuestionToken: variable.default != null,
    scope: Scope.Public,
    kind: StructureKind.Property,
  }));
}
