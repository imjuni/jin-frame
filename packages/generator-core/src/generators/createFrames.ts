import $RefParser from "@apidevtools/json-schema-ref-parser";
import type { OpenAPIV3 } from "openapi-types";
import { Project } from "ts-morph";
import { createBaseFrame } from "#/generators/createBaseFrame.js";
import { createFrame } from "#/generators/createFrame.js";
import { getInlineHost } from "#/generators/frames/getInlineHost.js";
import { getServerFrameEndpoint } from "#/generators/frames/getServerFrameEndpoint.js";
import type { ICreateFramesProps } from "#/generators/frames/interfaces/ICreateFramesProps.js";
import type { ICreateFramesResult } from "#/generators/frames/interfaces/ICreateFramesResult.js";
import { mergeParameters } from "#/generators/frames/mergeParameters.js";
import { generateHostValue } from "#/generators/hosts/generateHostValue.js";
import type { THttpMethod } from "#/https/method.js";

export async function createFrames(params: ICreateFramesProps): Promise<ICreateFramesResult[]> {
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
