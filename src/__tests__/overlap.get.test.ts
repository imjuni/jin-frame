import { JinEitherFrame } from '#frames/JinEitherFrame';
import { Post } from '#decorators/methods/Post';
import nock from 'nock';
import { afterEach, it } from 'vitest';
import { Param } from '#decorators/fields/Param';
import { Query } from '#decorators/fields/Query';
import { Body } from '#decorators/fields/Body';
import { Header } from '#decorators/fields/Header';

@Post({
  host: 'http://some.api.google.com',
  path: '/jinframe/:passing',
})
class TestGetFrame extends JinEitherFrame {
  @Param()
  @Query()
  @Body()
  @Header()
  declare public readonly id: string;

  @Query()
  declare public readonly name: string;

  @Query({ encode: false, comma: true })
  declare public readonly skills: string[];
}

afterEach(() => {
  nock.cleanAll();
});

it('overlap-param-query', async () => {
  nock('http://some.api.google.com')
    .post('/jinframe/pass?passing=pass&name=ironman&skills=beam%2Cflying%21')
    .reply(200, {
      message: 'hello',
    });

  const frame = TestGetFrame.of({ id: 'pass', name: 'ironman', skills: ['beam', 'flying!'] });
  await frame.execute();
});
