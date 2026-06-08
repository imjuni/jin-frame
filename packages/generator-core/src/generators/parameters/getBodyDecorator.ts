import type { IPropertyDecoratorData } from "#generators/interfaces/IPropertyData.js";

export function getBodyDecorator(kind: "Body" | "ObjectBody"): IPropertyDecoratorData[] {
  return [
    {
      name: kind,
      arguments: [],
    },
  ];
}
