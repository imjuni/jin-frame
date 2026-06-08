import $RefParser from "@apidevtools/json-schema-ref-parser";
import type { OpenAPIV3 } from "openapi-types";
import { Project } from "ts-morph";
import { createBaseFrameData } from "#generators/base-frame/createBaseFrameData.js";
import { createBaseFrameFromData } from "#generators/base-frame/createBaseFrameFromData.js";
import { createFrameData } from "#generators/frame/createFrameData.js";
import { createFrameFromData } from "#generators/frame/createFrameFromData.js";
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

  const baseFrameData =
    params.baseFrame != null
      ? createBaseFrameData({
          output: params.output,
          host: serverFrameEndpoint.host,
          hostCode: serverFrameEndpoint.hostCode,
          pathPrefix: serverFrameEndpoint.pathPrefix,
          serverVariables: serverFrameEndpoint.serverVariables,
          name: params.baseFrame,
          timeout: params.timeout,
        })
      : undefined;
  const baseFrame = baseFrameData == null ? undefined : createBaseFrameFromData(project, baseFrameData);

  const frameData = endpoints.map((endpoint) => ({
    endpoint,
    data: createFrameData(endpoint),
  }));
  const frames = frameData.map(({ endpoint, data }) => ({
    method: endpoint.method,
    pathKey: endpoint.pathKey,
    frame: createFrameFromData(project, data),
  }));

  if (baseFrame != null) {
    return [{ frame: baseFrame, method: "get", pathKey: "/" }, ...frames];
  }

  return frames;
}
