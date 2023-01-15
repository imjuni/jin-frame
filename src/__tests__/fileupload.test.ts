import { JinEitherFrame } from '@frames/JinEitherFrame';
import { JinFile } from '@frames/JinFile';
import debug from 'debug';
import fs from 'fs';
import { isPass } from 'my-only-either';
import nock from 'nock';
import path from 'path';

const log = debug('jinframe:test');

class TestGetFrame extends JinEitherFrame {
  @JinEitherFrame.body()
  public readonly description!: string;

  @JinEitherFrame.body()
  public readonly myFile!: JinFile;

  @JinEitherFrame.body()
  public readonly myFiles!: JinFile[];

  constructor(args: { description: string; file: JinFile; files: JinFile[] }) {
    super({
      host: 'http://some.api.google.com',
      path: '/fileupload-case04',
      method: 'post',
      contentType: 'multipart/form-data',
      ...args,
    });
  }
}

afterEach(() => {
  nock.cleanAll();
});

test('fileupload-test', async () => {
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

  const resp = await frame.execute();

  log('AxiosRequestConfig: ', isPass(resp) ? resp.pass.$debug.req : resp.fail.$debug.req);
  log('Resp: ', resp.type);
});
