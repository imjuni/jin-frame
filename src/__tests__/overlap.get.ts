import { JinEitherFrame } from '@frames/JinEitherFrame';
import debug from 'debug';
import { isPass } from 'my-only-either';
import nock from 'nock';

const log = debug('jinframe:test');

class TestGetFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  @JinEitherFrame.query()
  @JinEitherFrame.body()
  @JinEitherFrame.header()
  public readonly id!: string;

  @JinEitherFrame.query()
  public readonly name!: string;

  @JinEitherFrame.query({ encode: false, comma: true })
  public readonly skills!: string[];

  constructor(args: { id: string; name: string; skills: string[] }) {
    super({ host: 'http://some.api.google.com', path: '/jinframe/:id', method: 'post', ...args });
  }
}

afterEach(() => {
  nock.cleanAll();
});

test('overlap-param-query', async () => {
  nock('http://some.api.google.com')
    .post('/jinframe/pass?passing=pass&name=ironman&skills=beam%2Cflying%21')
    .reply(200, {
      message: 'hello',
    });

  const frame = new TestGetFrame({ id: 'pass', name: 'ironman', skills: ['beam', 'flying!'] });
  const resp = await frame.execute();

  log('AxiosRequestConfig: ', isPass(resp) ? resp.pass.$debug.req : resp.fail.$debug.req);
  log('Resp: ', resp.type);
});
