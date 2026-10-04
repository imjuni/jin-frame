import type { IPropertyDecoratorData } from "#generators/interfaces/IPropertyDecoratorData.js";

export function getBodyDecorator(kind: "Body" | "ObjectBody"): IPropertyDecoratorData[] {
  return [
    {
      name: kind,
      arguments: [],
    },
  ];
}
