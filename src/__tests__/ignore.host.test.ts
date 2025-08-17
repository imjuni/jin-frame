import { JinEitherFrame } from '#frames/JinEitherFrame';
import { Get } from '#decorators/methods/Get';
import { expect, it } from 'vitest';
import { Param } from '#decorators/fields/Param';
import { Query } from '#decorators/fields/Query';
import { Header } from '#decorators/fields/Header';

@Get({ host: '/jinframe/:passing/test' })
class TestGet2Frame extends JinEitherFrame {
  @Param()
  declare public readonly passing: string;

  @Query()
  declare public readonly name: string;

  @Header()
  declare public readonly ttt: string;
}

it('ignore-hostname-axios-request', async () => {
  const frame = TestGet2Frame.of({ passing: 'hello', name: 'ironman', ttt: 'c' });
  const req = frame.request();
  expect(req.url).toEqual('/jinframe/hello/test?name=ironman');
});
