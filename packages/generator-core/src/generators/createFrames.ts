import $RefParser from "@apidevtools/json-schema-ref-parser";
import type { OpenAPIV3 } from "openapi-types";
import { Project } from "ts-morph";
import { createBaseFrame } from "#generators/createBaseFrame.js";
import { createFrame } from "#generators/createFrame.js";
import { extractFrameEndpoints } from "#generators/frames/extractFrameEndpoints.js";
import { getInlineHost } from "#generators/frames/getInlineHost.js";
import { getServerFrameEndpoint } from "#generators/frames/getServerFrameEndpoint.js";
import type { ICreateFramesProps } from "#generators/frames/interfaces/ICreateFramesProps.js";
import type { ICreateFramesResult } from "#generators/frames/interfaces/ICreateFramesResult.js";
import { generateHostValue } from "#generators/hosts/generateHostValue.js";

export async function createFrames(params: ICreateFramesProps): Promise<ICreateFramesResult[]> {
  const document = await $RefParser.dereference<OpenAPIV3.Document>(params.document);
  const project = new Project();

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

  const endpoints = extractFrameEndpoints({
    params,
    document,
    host,
    hostCode,
  });

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

  const frames = endpoints.map((endpoint) => ({
    method: endpoint.method,
    pathKey: endpoint.pathKey,
    frame: createFrame(project, endpoint),
  }));

  if (baseFrame != null) {
    return [{ frame: baseFrame, method: "get", pathKey: "/" }, ...frames];
  }

  return frames;
}
