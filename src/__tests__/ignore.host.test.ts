import { JinEitherFrame } from '#frames/JinEitherFrame';
import { expect, it } from 'vitest';

class TestGet2Frame extends JinEitherFrame {
  @JinEitherFrame.param()
  public declare readonly passing: string;

  @JinEitherFrame.query()
  public declare readonly name: string;

  @JinEitherFrame.header()
  public declare readonly ttt: string;

  constructor() {
    super({ $$path: '/jinframe/:passing/test', $$method: 'get' });

    this.passing = 'hello';
    this.name = 'ironman';
    this.ttt = 'header value';
  }
}

it('ignore-hostname-axios-request', async () => {
  const frame = new TestGet2Frame();
  const req = frame.request();
  expect(req.url).toEqual('/jinframe/hello/test?name=ironman');
});
