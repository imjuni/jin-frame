import { JinEitherFrame } from '#frames/JinEitherFrame';
import { Get } from '#tools/decorators/MethodDecorators';
import { expect, it } from 'vitest';

@Get({ host: '/jinframe/:passing/test' })
class TestGet2Frame extends JinEitherFrame {
  @JinEitherFrame.param()
  declare public readonly passing: string;

  @JinEitherFrame.query()
  declare public readonly name: string;

  @JinEitherFrame.header()
  declare public readonly ttt: string;
}

it('ignore-hostname-axios-request', async () => {
  const frame = new TestGet2Frame({ passing: 'hello', name: 'ironman', ttt: 'c' });
  const req = frame.request();
  expect(req.url).toEqual('/jinframe/hello/test?name=ironman');
});
