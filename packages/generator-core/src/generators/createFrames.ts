import $RefParser from '@apidevtools/json-schema-ref-parser';
import type { THttpMethod } from '#/https/method';
import type { OpenAPIV3 } from 'openapi-types';
import { createFrame } from '#/generators/createFrame';
import { Project } from 'ts-morph';
import { createBaseFrame } from '#/generators/createBaseFrame';

export interface IProps {
  specTypeFilePath: string;
  baseFrame?: string;
  host: string;
  output: string;
  useCodeFence: boolean;
  timeout?: number;
  document: OpenAPIV3.Document;
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

  const baseFrame =
    params.baseFrame != null
      ? createBaseFrame(project, {
          output: params.output,
          host: params.host,
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
                  host: params.host,
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
