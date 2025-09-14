import type { PropertyDeclarationStructure } from 'ts-morph';

export function getBodyDecorator(
  kind: 'Body' | 'ObjectBody',
): PropertyDeclarationStructure['decorators'] {
  return [
    {
      name: kind,
      arguments: [],
    },
  ];
}
