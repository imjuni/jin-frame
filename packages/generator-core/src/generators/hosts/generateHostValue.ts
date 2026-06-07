import { generateEnvFunction } from "#/generators/hosts/generateEnvFunction";
import type { IGenerateHostValueParams } from "#/generators/hosts/interfaces/IGenerateHostValueParams";

export function generateHostValue(params: IGenerateHostValueParams): string {
  const { servers, options } = params;
  const strategy = options.hostStrategy ?? "string";

  if (options.host) {
    return strategy === "string" ? `'${options.host}'` : `() => '${options.host}'`;
  }

  const primaryServer = servers[0];
  if (!primaryServer) {
    throw new Error("No servers found in OpenAPI specification");
  }

  switch (strategy) {
    case "string":
      return `'${primaryServer.url}'`;

    case "function": {
      const functionName = options.hostFunctionName ?? "getApiHost";
      return functionName;
    }

    case "env-function":
      return generateEnvFunction(servers, options);

    default:
      throw new Error(`Unknown host strategy: ${strategy}`);
  }
}
