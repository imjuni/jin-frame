import { JinEitherFrame } from '#frames/JinEitherFrame';
import { JinFile } from '#frames/JinFile';
import fs from 'node:fs';
import nock from 'nock';
import path from 'node:path';
import { afterEach, it } from 'vitest';

class TestGetFrame extends JinEitherFrame {
  @JinEitherFrame.body()
  declare public readonly description: string;

  @JinEitherFrame.body()
  declare public readonly myFile: JinFile<Buffer>;

  @JinEitherFrame.body()
  declare public readonly myFiles: JinFile<Buffer>[];

  constructor(args: { description: string; file: JinFile<Buffer>; files: JinFile<Buffer>[] }) {
    super({
      ...args,
      $$host: 'http://some.api.google.com',
      $$path: '/fileupload-case04',
      $$method: 'post',
      $$contentType: 'multipart/form-data',
    });
  }
}

afterEach(() => {
  nock.cleanAll();
});

it('fileupload-test', async () => {
  nock('http://some.api.google.com').post('/fileupload-case04').reply(200, {
    message: 'hello',
  });

  const frame = new TestGetFrame({
    description: 'test',
    file: new JinFile('README.md', fs.readFileSync(path.join(process.cwd(), 'README.md'))),
    files: [
      new JinFile('README01.md', fs.readFileSync(path.join(process.cwd(), 'README.md'))),
      new JinFile('README02.md', fs.readFileSync(path.join(process.cwd(), 'README.md'))),
      new JinFile('README03.md', fs.readFileSync(path.join(process.cwd(), 'README.md'))),
      new JinFile('README04.md', fs.readFileSync(path.join(process.cwd(), 'README.md'))),
    ],
  });

  await frame.execute();
});
