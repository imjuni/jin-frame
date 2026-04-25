import { Project } from 'ts-morph';
import util from 'node:util';
import { randomFilename } from '#/tools/randomFilename';

/**
 * host 반환 함수를 생성하는 함수
 *
 * @param hosts OpenAPI 스펙 문서에 포함된 서버와 사용자가 전달한 host를 배열로 전달
 * @returns hosts 배열을 사용해서 만든 host 반환 함수
 */
export function renderHostFunc(hosts: string[]): string {
  const filename = randomFilename();
  const project = new Project();
  const sourceFile = project.createSourceFile(filename);
  const functionNode = sourceFile.addFunction({ name: 'getHost' });

  functionNode.setBodyText((writer) =>
    writer
      .writeLine(`const hosts = ${util.inspect(hosts)};`)
      .writeLine('const host = hosts.at(0);')
      .writeLine('if (host == null) {')
      .writeLine("    throw new Error('Cannot found host: undefined');")
      .writeLine('}')
      .writeLine('return host;'),
  );

  const sourceCode = functionNode.getText();

  return sourceCode;
}
