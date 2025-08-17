import { JinEitherFrame } from '#frames/JinEitherFrame';
import { JinFile } from '#frames/JinFile';
import fs from 'node:fs';
import nock from 'nock';
import path from 'node:path';
import { afterEach, it } from 'vitest';
import { Post } from '#decorators/methods/Post';
import { Body } from '#decorators/fields/Body';

@Post({ host: 'http://some.api.google.com/fileupload-case04', contentType: 'multipart/form-data' })
class TestGetFrame extends JinEitherFrame {
  @Body()
  declare public readonly description: string;

  @Body()
  declare public readonly myFile: JinFile<Buffer>;

  @Body()
  declare public readonly myFiles: JinFile<Buffer>[];
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
    myFile: new JinFile('README.md', fs.readFileSync(path.join(process.cwd(), 'README.md'))),
    myFiles: [
      new JinFile('README01.md', fs.readFileSync(path.join(process.cwd(), 'README.md'))),
      new JinFile('README02.md', fs.readFileSync(path.join(process.cwd(), 'README.md'))),
      new JinFile('README03.md', fs.readFileSync(path.join(process.cwd(), 'README.md'))),
      new JinFile('README04.md', fs.readFileSync(path.join(process.cwd(), 'README.md'))),
    ],
  });

  await frame.execute();
});
