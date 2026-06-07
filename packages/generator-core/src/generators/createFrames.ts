import $RefParser from "@apidevtools/json-schema-ref-parser";
import type { OpenAPIV3 } from "openapi-types";
import { Project } from "ts-morph";
import { createBaseFrame } from "#/generators/createBaseFrame";
import { createFrame } from "#/generators/createFrame";
import { generateHostValue } from "#/generators/hosts/generateHostValue";
import { getHost } from "#/generators/hosts/getHost";
import { getServerUrl } from "#/generators/hosts/getServerUrl";
import type { THttpMethod } from "#/https/method";
import { safeUrl } from "#/tools/safeUrl";

export interface IProps {
  specTypeFilePath: string;
  specFilePath?: string;
  baseFrame?: string;
  host?: string;
  output: string;
  useCodeFence: boolean;
  timeout?: number;
  document: OpenAPIV3.Document;
  hostStrategy?: "string" | "function" | "env-function";
  hostEnvVar?: string;
  hostFunctionName?: string;
  serverMapping?: Record<string, string>;
}

interface IServerFrameEndpoint {
  host?: string;
  hostCode?: string;
  pathPrefix?: string;
  serverVariables?: Record<string, OpenAPIV3.ServerVariableObject>;
}

function splitServerUrl(value: string): Pick<IServerFrameEndpoint, "host" | "pathPrefix"> {
  const templateMatched = value.match(/^([A-Za-z][A-Za-z0-9+.-]*:\/\/[^/]+)(\/.*)?$/);

  if (templateMatched != null && value.includes("{")) {
    return {
      host: templateMatched[1],
      pathPrefix: templateMatched[2],
    };
  }

  const absoluteUrl = safeUrl(value);

  if (absoluteUrl != null) {
    const pathPrefix = absoluteUrl.pathname !== "/" ? absoluteUrl.pathname : undefined;
    return { host: absoluteUrl.origin, pathPrefix };
  }

  const matched = value.match(/^([A-Za-z][A-Za-z0-9+.-]*:\/\/[^/]+)(\/.*)?$/);

  if (matched != null) {
    return {
      host: matched[1],
      pathPrefix: matched[2],
    };
  }

  if (value.startsWith("/")) {
    return { pathPrefix: value };
  }

  return { host: value };
}

function getServerFrameEndpoint(params: IProps, document: OpenAPIV3.Document): IServerFrameEndpoint {
  const server = document.servers?.at(0);

  if (params.hostStrategy === "function" || params.hostStrategy === "env-function") {
    return {
      hostCode: generateHostValue({
        servers: document.servers ?? [],
        options: {
          hostStrategy: params.hostStrategy,
          hostEnvVar: params.hostEnvVar,
          hostFunctionName: params.hostFunctionName,
          serverMapping: params.serverMapping,
          host: params.host,
        },
      }),
      serverVariables: server?.variables,
    };
  }

  if (params.host != null) {
    return { ...splitServerUrl(params.host), serverVariables: server?.variables };
  }

  if (server != null) {
    const serverUrl = safeUrl(server.url);

    if (serverUrl != null || /^([A-Za-z][A-Za-z0-9+.-]*:\/\/[^/]+)(\/.*)?$/.test(server.url)) {
      return { ...splitServerUrl(server.url), serverVariables: server.variables };
    }

    const specUrl = safeUrl(params.specFilePath ?? params.specTypeFilePath);
    if (specUrl != null) {
      const resolved = getServerUrl({ specUrl, server });
      return { ...splitServerUrl(resolved.url.href), serverVariables: server.variables };
    }

    return { pathPrefix: server.url, serverVariables: server.variables };
  }

  const fallbackHost = getHost({
    host: params.host,
    specTypeFilePath: params.specFilePath ?? params.specTypeFilePath,
    document,
  });

  return splitServerUrl(fallbackHost);
}

function getInlineHost(endpoint: IServerFrameEndpoint): string {
  if (endpoint.host != null && endpoint.pathPrefix != null) {
    return `${endpoint.host}${endpoint.pathPrefix}`;
  }

  return endpoint.host ?? endpoint.pathPrefix ?? "";
}

function mergeParameters(
  pathParameters?: OpenAPIV3.PathItemObject["parameters"],
  operationParameters?: OpenAPIV3.OperationObject["parameters"],
): OpenAPIV3.OperationObject["parameters"] | undefined {
  const parameters = [...(pathParameters ?? []), ...(operationParameters ?? [])];

  if (parameters.length === 0) {
    return undefined;
  }

  return Array.from(
    parameters
      .reduce((aggregate, parameter) => {
        if ("$ref" in parameter) {
          aggregate.set(parameter.$ref, parameter);
          return aggregate;
        }

        aggregate.set(`${parameter.in}:${parameter.name}`, parameter);
        return aggregate;
      }, new Map<string, OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject>())
      .values(),
  );
}

export async function createFrames(params: IProps): Promise<
  {
    method: THttpMethod;
    pathKey: string;
    frame: ReturnType<typeof createFrame>;
  }[]
> {
  const document = await $RefParser.dereference<OpenAPIV3.Document>(params.document);
  const paths = document.paths ?? {};
  const project = new Project();
  const methods: THttpMethod[] = ["get", "post", "put", "delete", "patch", "head", "options"];

  const serverFrameEndpoint = getServerFrameEndpoint(params, document);
  const host =
    params.baseFrame != null
      ? (serverFrameEndpoint.host ?? serverFrameEndpoint.hostCode ?? "")
      : getInlineHost(serverFrameEndpoint);

  // For function/env-function strategies, generate raw host code to embed verbatim in decorators
  const hostCode =
    params.hostStrategy === "function" || params.hostStrategy === "env-function"
      ? generateHostValue({
          servers: document.servers ?? [],
          options: {
            hostStrategy: params.hostStrategy,
            hostEnvVar: params.hostEnvVar,
            hostFunctionName: params.hostFunctionName,
            serverMapping: params.serverMapping,
            host: params.host,
          },
        })
      : undefined;

  const baseFrame =
    params.baseFrame != null
      ? createBaseFrame(project, {
          output: params.output,
          host: serverFrameEndpoint.host,
          hostCode: serverFrameEndpoint.hostCode,
          pathPrefix: serverFrameEndpoint.pathPrefix,
          serverVariables: serverFrameEndpoint.serverVariables,
          name: params.baseFrame,
          timeout: params.timeout,
        })
      : undefined;

  const frames = Object.keys(paths).flatMap((pathKey) => {
    const apiPath = paths[pathKey];
    const pathParameters = apiPath?.parameters;

    const operations = methods
      .map((method) => {
        const operation = apiPath?.[method];
        const mergedOperation =
          operation == null
            ? undefined
            : {
                ...operation,
                parameters: mergeParameters(pathParameters, operation.parameters),
              };
        const frame =
          mergedOperation == null
            ? undefined
            : createFrame(project, {
                specTypeFilePath: params.specTypeFilePath,
                output: params.output,
                host,
                hostCode,
                baseFrame: params.baseFrame,
                pathKey,
                method,
                operation: mergedOperation,
              });
        return { method, pathKey, frame };
      })
      .filter(
        (
          operation,
        ): operation is {
          method: THttpMethod;
          pathKey: string;
          frame: ReturnType<typeof createFrame>;
        } => operation.frame != null,
      );

    return operations;
  });

  if (baseFrame != null) {
    return [{ frame: baseFrame, method: "get", pathKey: "/" }, ...frames];
  }

  return frames;
}
