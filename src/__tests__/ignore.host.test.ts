import { JinEitherFrame } from '#frames/JinEitherFrame';
import { expect, it } from 'vitest';

class TestGet2Frame extends JinEitherFrame {
  @JinEitherFrame.param()
  declare public readonly passing: string;

  @JinEitherFrame.query()
  declare public readonly name: string;

  @JinEitherFrame.header()
  declare public readonly ttt: string;

  constructor() {
    super(
      {
        passing: 'hello',
        name: 'ironman',
        ttt: 'header value',
      },
      { path: '/jinframe/:passing/test', method: 'get' },
    );
  }
}

it('ignore-hostname-axios-request', async () => {
  const frame = new TestGet2Frame();
  const req = frame.request();
  expect(req.url).toEqual('http://localhost/jinframe/hello/test?name=ironman');
});
