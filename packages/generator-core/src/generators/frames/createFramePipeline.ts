import { Project } from "ts-morph";
import { createBaseFrameData } from "#generators/base-frame/createBaseFrameData.js";
import { createBaseFrameFromData } from "#generators/base-frame/createBaseFrameFromData.js";
import { createFrameData } from "#generators/frame/createFrameData.js";
import { createFrameFromData } from "#generators/frame/createFrameFromData.js";
import { extractFrameEndpoints } from "#generators/frames/extractFrameEndpoints.js";
import type { ICreateFramePipelineParams } from "#generators/frames/interfaces/ICreateFramePipelineParams.js";
import type { ICreateFramesResult } from "#generators/frames/interfaces/ICreateFramesResult.js";
import { createSecurityProviderData } from "#generators/security/createSecurityProviderData.js";
import { createSecurityProviderFromData } from "#generators/security/createSecurityProviderFromData.js";

export function createFramePipeline({
  params,
  context,
  project = new Project(),
}: ICreateFramePipelineParams): ICreateFramesResult[] {
  const securityProviderData = createSecurityProviderData(context.document, {
    securityProviderDir: params.securityProviderDir,
    securityProviders: params.securityProviders,
  });
  const endpoints = extractFrameEndpoints({
    params,
    document: context.document,
    host: context.host,
    hostCode: context.hostCode,
    securityProviders: securityProviderData.references,
  });
  const baseFrameData =
    params.baseFrame != null
      ? createBaseFrameData({
          output: params.output,
          host: context.serverFrameEndpoint.host,
          hostCode: context.serverFrameEndpoint.hostCode,
          hostFunctionImport: params.hostStrategy === "function" ? params.hostFunctionImport : undefined,
          pathPrefix: context.serverFrameEndpoint.pathPrefix,
          serverVariables: context.serverFrameEndpoint.serverVariables,
          name: params.baseFrame,
          timeout: params.timeout,
        })
      : undefined;
  const baseFrame = baseFrameData == null ? undefined : createBaseFrameFromData(project, baseFrameData);

  const frames = endpoints
    .map((endpoint) => ({
      endpoint,
      data: createFrameData(endpoint),
    }))
    .map(({ endpoint, data }) => ({
      method: endpoint.method,
      pathKey: endpoint.pathKey,
      frame: createFrameFromData(project, data),
    }));
  const securityProviders = securityProviderData.providers.map((provider) => ({
    method: "get" as const,
    pathKey: "/",
    frame: createSecurityProviderFromData(project, provider),
  }));

  if (baseFrame != null) {
    return [{ frame: baseFrame, method: "get", pathKey: "/" }, ...securityProviders, ...frames];
  }

  return [...securityProviders, ...frames];
}
