import type { Project } from 'ts-morph';
import { randomUUID } from 'node:crypto';
import { pascalCase } from 'change-case';

function getBaseFrameJsDoc(timeout?: number): string {
  const defaultTimeout = `Base Frame

In most infrastructures, such as Cloudflare, AWS ALB, and Nginx, 
the default timeout value is around 60 seconds. The default timeout 
has been set to 60 seconds.`;

  const withTimeout = `Base Frame

Timeout ${timeout} milliseconds.`;

  if (timeout != null) {
    return withTimeout;
  }

  return defaultTimeout;
}

interface IProps {
  output: string;
  host: string;
  name: string;
  timeout?: number;
}

interface IResult {
  filePath: string;
  tag?: string;
  aliasFilePath: string;
  source: string;
}

export function createBaseFrame(project: Project, params: IProps): IResult {
  const name = pascalCase(params.name);
  const timeout = params?.timeout ?? 60_000;
  const aliasFilePath = `${randomUUID()}-${randomUUID()}.ts`;
  const sourceFile = project.createSourceFile(aliasFilePath);

  sourceFile.addImportDeclaration({
    moduleSpecifier: 'jin-frame',
    namedImports: ['Get', 'JinFrame', 'Timeout'],
  });

  sourceFile.addClass({
    name,
    docs: [{ description: getBaseFrameJsDoc(params?.timeout) }],
    typeParameters: [
      {
        name: 'SUCCESS',
        default: 'unknown',
      },
      {
        name: 'FAIL',
        default: 'unknown',
      },
    ],
    decorators: [
      {
        name: 'Get',
        arguments: [`{ host: '${params.host}' }`],
      },
      timeout != null
        ? {
            name: 'Timeout',
            arguments: ['60_000'],
          }
        : undefined,
    ].filter((decorator) => decorator != null),
    properties: [],
    isExported: true,
    extends: 'JinFrame<SUCCESS, FAIL>',
  });

  return {
    filePath: `${name}.ts`,
    tag: undefined,
    aliasFilePath,
    source: sourceFile.print(),
  };
}
