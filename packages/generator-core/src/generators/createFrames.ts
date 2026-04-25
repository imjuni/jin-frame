import $RefParser from '@apidevtools/json-schema-ref-parser';
import type { THttpMethod } from '#/https/method';
import type { OpenAPIV3 } from 'openapi-types';
import { createFrame } from '#/generators/createFrame';
import { Project } from 'ts-morph';
import { createBaseFrame } from '#/generators/createBaseFrame';
import { getHost } from '#/generators/hosts/getHost';
import { generateHostValue } from '#/generators/hosts/generateHostValue';

export interface IProps {
  specTypeFilePath: string;
  baseFrame?: string;
  host?: string;
  output: string;
  useCodeFence: boolean;
  timeout?: number;
  document: OpenAPIV3.Document;
  hostStrategy?: 'string' | 'function' | 'env-function';
  hostEnvVar?: string;
  hostFunctionName?: string;
  serverMapping?: Record<string, string>;
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
  const methods: THttpMethod[] = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'];

  const host = getHost({ host: params.host, specTypeFilePath: params.specTypeFilePath, document });

  // For function/env-function strategies, generate raw host code to embed verbatim in decorators
  const hostCode =
    params.hostStrategy === 'function' || params.hostStrategy === 'env-function'
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
          host,
          name: params.baseFrame,
          timeout: params.timeout,
        })
      : undefined;

  const frames = Object.keys(paths)
    .map((pathKey) => {
      const apiPath = paths[pathKey];

      const operations = methods
        .map((method) => {
          const operation = apiPath?.[method];
          const frame =
            operation == null
              ? undefined
              : createFrame(project, {
                  specTypeFilePath: params.specTypeFilePath,
                  output: params.output,
                  host,
                  hostCode,
                  baseFrame: params.baseFrame,
                  pathKey,
                  method,
                  operation,
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
    })
    .flat();

  if (baseFrame != null) {
    return [{ frame: baseFrame, method: 'get', pathKey: '/' }, ...frames];
  }

  return frames;
}
