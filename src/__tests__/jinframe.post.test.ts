import { JinEitherFrame } from '#frames/JinEitherFrame';
import { Post } from '#decorators/methods/Post';
import { isPass } from 'my-only-either';
import nock from 'nock';
import { afterEach, describe, expect, it } from 'vitest';
import { Param } from '#decorators/fields/Param';
import { Body } from '#decorators/fields/Body';
import { Header } from '#decorators/fields/Header';

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class TestPostFrame extends JinEitherFrame {
  @Param()
  declare public readonly passing: string;

  @Body({ replaceAt: 'test.hello.marvel.name' })
  declare public readonly name: string;

  @Header({ replaceAt: 'test.hello.marvel.skill' })
  declare public readonly skill: string;

  @Body({ replaceAt: 'test.hello.marvel.gender' })
  declare public readonly gender: string;

  constructor() {
    super({
      passing: 'pass',
      name: 'ironman',
      skill: 'beam',
      gender: 'male',
    });
  }
}

@Post({
  host: 'http://some.api.google.com/jinframe/:passing',
  contentType: 'application/x-www-form-urlencoded',
})
class TestUrlencodedPostFrame extends JinEitherFrame {
  @Param()
  declare public readonly passing: string;

  @Body()
  declare public readonly username: string;

  @Body()
  declare public readonly password: string;

  constructor() {
    super({
      passing: 'pass',
      username: 'ironman',
      password: 'marvel',
    });
  }
}

describe('jinframe.test', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('nock-post-with-jinframe', async () => {
    nock('http://some.api.google.com').post('/jinframe/pass').reply(200, {
      message: 'hello',
    });

    const frame = new TestPostFrame();
    const resp = await frame.execute();

    expect(isPass(resp)).toEqual(true);
  });

  it('nock-post-without-eiter-jinframe', async () => {
    nock('http://some.api.google.com').post('/jinframe/pass').reply(200, {
      message: 'hello',
    });

    const frame = new TestPostFrame();
    const resp = await frame.execute();

    expect(isPass(resp)).toEqual(true);
  });

  it('nock-post-urlencoded', async () => {
    nock('http://some.api.google.com').post('/jinframe/pass', 'username=ironman&password=marvel').reply(200, {
      message: 'hello',
    });

    const frame = new TestUrlencodedPostFrame();
    const resp = await frame.execute();

    expect(isPass(resp)).toEqual(true);
  });
});
