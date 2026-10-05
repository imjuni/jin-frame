export function getServerVariableDefaultMethods(
  name: string,
  serverVariableDefaults: Record<string, string>,
): { name: string; returnType: string; statements: string[] }[] {
  if (Object.keys(serverVariableDefaults).length === 0) {
    return [];
  }

  return [
    {
      name: "getDefaultValues",
      returnType: `Partial<${name}>`,
      statements: [
        `return ${`{ ${Object.entries(serverVariableDefaults)
          .map(([key, value]) => `${JSON.stringify(key)}: ${JSON.stringify(value)}`)
          .join(", ")} }`};`,
      ],
    },
  ];
}
