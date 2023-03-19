import { JinEitherFrame } from '#frames/JinEitherFrame';
import nock from 'nock';

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
    super({ ...args, $$host: 'http://some.api.google.com', $$path: '/jinframe/:id', $$method: 'post' });
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
  await frame.execute();
});
